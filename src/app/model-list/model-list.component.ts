import { Component, OnInit } from '@angular/core';
import { Model, Prediction, Globals } from '../Globals';
import { CommonFunctions } from '../common.functions';
import { CommonService } from '../common.service';
import 'datatables.net-bs4';
declare var $: any;
@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.scss']
})
export class ModelListComponent implements OnInit {

  models: Array<any>;
  modelsSelected: Array<any> = [];
  objectKeys = Object.keys;
  modelsDocumentation: Array<any> = [];

  constructor( public model: Model,
    public globals: Globals,
    public prediction: Prediction,
    public func: CommonFunctions, private commonService: CommonService) { }

    ngOnInit():void {
      this.prediction.name = undefined;
      this.model.name = undefined;
      this.model.version = undefined;
      this.func.getModelList();
      // preload the documentation of the models to avoid multiple requests to the api.
      setTimeout(() => {this.getAllDocumentation() },200)
      
    }
    getAllDocumentation(){
     for (let key of Object.keys(this.model.listModels)){
       this.commonService.getDocumentation(this.model.listModels[key].name,this.model.listModels[key].version, 'JSON').subscribe(
         result => {
           this.modelsDocumentation.push({'name':key,'result':result});
         },
         error => {
           alert('documentation file not found');
         }
       );
     }
  
    }

    onChange(name,version,quantitative,type, event):void {

      const documentation = this.modelsDocumentation.find(el =>  el.name == name+'-'+version) //get documentation of model
      const endpoint = documentation.result['Endpoint'].value || 'na'  //get endpoint values
      
      // check if model is quantitative or qualitative
      if(quantitative){ quantitative = 'quantitative'} else quantitative = "qualitative";

      const obj = {
        name: name,
        quantitative: quantitative,
        type: type,
        version:version,
        endpoint:endpoint
      }

      const isChecked = event.target.checked;
      if(isChecked) {
        this.modelsSelected.push(obj);
      } else {
        let index = this.modelsSelected.indexOf(obj);
        this.modelsSelected.splice(index,1);
      }

    }

    selectAll(event){
      //pending comment
      const isChecked = event.target.checked;
      var lastPage = false;
      
      let ctxPage = document.getElementsByClassName('page-link') 
      let startPage = <HTMLElement>ctxPage[1]
      startPage.click()

       while(!lastPage){
         let checkBoxes = document.querySelectorAll<HTMLElement | any>('.form-check-input');
         checkBoxes.forEach(chckbox =>  {

          if (chckbox.checked != isChecked)  chckbox.click();

         })
         let nextPage = document.getElementById('dataTableModels_next')

         lastPage = nextPage.className.includes('disabled')
         nextPage.click();
         
       }
    }
}
