import { Component, OnInit } from '@angular/core';
import { Compound, Globals } from '../Globals';
import { Renderer2 } from '@angular/core';
import { CommonService } from '../common.service';
import { ToastrService } from 'ngx-toastr';
// import { ToastrService } from 'ngx-toastr';
// import 'jsme-editor';

// declare var $: any;
@Component({
  selector: 'app-sketch-structure',
  templateUrl: './sketch-structure.component.html',
  styleUrls: ['./sketch-structure.component.scss']
})
export class SketchStructureComponent implements OnInit {

  objectKeys = Object.keys;

  modelName = '';
  isvalid: boolean = false;
  isvalidSketch: boolean = true;
  sketchName = 'sketched_mol';
  sketchSmiles: string = ''

  constructor(
    public globals: Globals,
    private renderer2: Renderer2,
    public compound: Compound,
    public commonService: CommonService,
    private toastr: ToastrService
    
    // private toastr: ToastrService,
    ) { }
    saveStructure(){
      var span = document.getElementById('molclipboard')
      this.sketchSmiles = span.innerText
      //check name
      if(this.isvalidSketch && this.sketchSmiles){
        this.commonService.isValidCompound$.emit(true);
        this.compound.sketchstructure = {'name':this.sketchName,'smiles':this.sketchSmiles}
        let modeltab =  document.getElementById('build-tab-line');
        modeltab.click();
        this.toastr.success('Successfully', 'Save '+this.compound.sketchstructure['name'], {
          timeOut: 5000, positionClass: 'toast-top-right'
        });
      

      }else {
        alert('no molecule entered!')
        return;
      }

      
    }
  ngOnInit(): void {
      // inject into the HTML code these two scripts required by JSME
      const jsme_script = this.renderer2.createElement('script');
      jsme_script.type = 'text/javascript';
      jsme_script.src = 'assets/jsme/jsme.nocache.js';
      jsme_script.text = ``;
      this.renderer2.appendChild(document.body, jsme_script);
  
      const jsme_init = this.renderer2.createElement('script');
      jsme_init.type = 'text/javascript';
      // jsme_init.src = 'assets/jsme/init.js';
      jsme_init.src = 'assets/jsme/initQuery.js';
      jsme_init.text = ``;
      this.renderer2.appendChild(document.body, jsme_init);
    

 
  }

  sketchNameChange(){
    this.isvalidSketch = true;
    const letters = /^[A-Za-z0-9_]+$/;
    if (!(this.sketchName.match(letters))) this.isvalidSketch = false;
  }

}