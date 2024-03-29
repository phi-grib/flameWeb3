import { Component, OnInit, ViewChild } from '@angular/core';
import { Model, Prediction, Globals, Compound } from '../Globals';
import { CommonFunctions } from '../common.functions';
import { CommonService } from '../common.service';
import 'datatables.net-bs4';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.scss'],
})
export class ModelListComponent implements OnInit {
  models: Array<any>;
  objectKeys = Object.keys;
  modelsDocumentation: Array<any> = [];

  constructor(
    public model: Model,
    public globals: Globals,
    public prediction: Prediction,
    public func: CommonFunctions,
    private commonService: CommonService,
    public compound: Compound,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.commonService.loadCollection$.subscribe(res => {
      this.checkCollection(res);
    })
    this.model.name = undefined;
    this.model.version = undefined;
    this.func.getModelList();
    // preload the documentation of the models to avoid multiple requests to the api.
    // setTimeout(() => {
    //   this.getAllDocumentation();
    // }, 200);
  }
  // getAllDocumentation() {
  //   for (let key of Object.keys(this.model.listModels)) {
  //     this.commonService
  //       .getDocumentation(
  //         this.model.listModels[key].name,
  //         this.model.listModels[key].version,
  //         'JSON'
  //       )
  //       .subscribe(
  //         (result) => {
  //           this.modelsDocumentation.push({ name: key, result: result });
  //         },
  //         (error) => {
  //           console.log('documentation file not found:', key);
  //         }
  //       );
  //   }
  // }
  checkCollection(collect: Object) {
    var notFound = []
    for (let i = 0; i < collect['endpoints'].length; i++) {
      var found = false
      const element = collect['endpoints'][i] + '-' + collect['versions'][i]
      for (let key in this.model.listModels) {
        if (element == key) {
          found = true
        }
      }
      if (!found) notFound.push(element)
    }
    if (notFound.length > 0) {
      console.log(notFound)
      this.toastr.error('Collection ' + collect['name'] + ' \n Contains models not found in the current repository:' + '\n' + notFound, 'Failed', {
        timeOut: 10000, positionClass: 'toast-top-right'
      });
    } else {
      this.loadCollection(collect);
    }
  }
  loadCollection(collect: Object) {
    this.model.listModelsSelected = []

    $('#dataTableModels').DataTable().rows().every(function (idx, tableLoop, rowLoop) {
      var node = this.node()
      let checkbox = node.childNodes[0].childNodes[0]
      checkbox.checked = false; //first clean all checkboxes
    });

    const self = this;
    $('#dataTableModels').DataTable().rows().every(function (idx, tableLoop, rowLoop) {
      var data = this.data();
      var node = this.node()
      let checkbox = node.childNodes[0].childNodes[0]
      for (let i = 0; i < collect['endpoints'].length; i++) {
        if (data[2] == collect['endpoints'][i] && data[3] == collect['versions'][i]) {
          checkbox.checked = true;
          const obj = {
            name: data[2],
            version: parseInt(data[3]),
          };
          self.model.listModelsSelected.push(obj)
        }
      }
    });
  }
  onChange(name, version, event): void {
    const obj = {
      name: name,
      version: version,
    };
    const isChecked = event.target.checked;
    if (isChecked) {
      this.model.listModelsSelected.push(obj);
    } else {
      this.model.listModelsSelected.splice(
        this.model.listModelsSelected.findIndex(
          (model) => model.name === name && model.version === version
        ),
        1
      );
    }
  }

  selectAll(event) {
    //pending comment
    const isChecked = event.target.checked;
    var lastPage = false;

    let ctxPage = document.getElementsByClassName('page-link');
    let startPage = <HTMLElement>ctxPage[1];
    startPage.click();

    while (!lastPage) {
      let checkBoxes = document.querySelectorAll<HTMLElement | any>(
        '.form-check-input'
      );
      checkBoxes.forEach((chckbox) => {
        if (chckbox.checked != isChecked) chckbox.click();
      });
      let nextPage = document.getElementById('dataTableModels_next');

      lastPage = nextPage.className.includes('disabled');
      nextPage.click();
    }
  }
}
