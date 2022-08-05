import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../common.service';
import { Compound, Globals, Model, Prediction } from '../Globals';
import { PredictorService } from '../manage-models/predictor.service';
declare var $: any;
@Component({
  selector: 'predict-button',
  templateUrl: './predict-button.component.html',
  styleUrls: ['./predict-button.component.scss'],
})
export class PredictButtonComponent implements OnInit {
  endpoints = [];
  versions = [];
  isValidCompound: boolean = false;
  predictionName: string = '';
  isvalidProfile: boolean = true;
  constructor(
    public commonService: CommonService,
    public compound: Compound,
    private service: PredictorService,
    public prediction: Prediction,
    private toastr: ToastrService,
    public model: Model
  ) {
  }

  ngOnInit(): void {
    this.prediction.profileName = 'Profile1'
    $(function () {
      $('[data-toggle="popover"]').popover();
    });
    this.commonService.isValidCompound$.subscribe(
      (value) => (this.isValidCompound = value)
    );
  }
  select_prediction() {
    if (this.compound.input_file) {
      this.predict();
    }
    if (this.compound.sketchstructure) {
      this.predictStructure();
    }
    if (this.compound.input_list) {
      this.predictInputList();
    }
  }
  profileNameChange(){
    this.isvalidProfile = true;
    const letters = /^[A-Za-z0-9_]+$/;
    if (!this.prediction.profileName.match(letters) || this.prediction.profileName == '') {
      this.isvalidProfile = false;
    }
  }
  predictStructure() {
    this.filterModels();
    this.service
      .predictSketchStructure(
        this.prediction.profileName,
        this.compound.sketchstructure['result'],
        this.compound.sketchstructure['name'],
        JSON.stringify(this.endpoints),
        JSON.stringify(this.versions)
      )
      .subscribe(
        (result) => {
          // I need boolean. not string message
          if (result) {
            this.commonService.setPredictionExec(true);
            this.toastr.success(
              this.compound.sketchstructure['name'],
              'PREDICTION COMPLETED',
              {
                timeOut: 4000,
                positionClass: 'toast-top-right',
                progressBar: true,
              }
            );
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }
  predict() {
    this.filterModels();

    this.toastr.info('Running!', 'Prediction ' + this.prediction.profileName, {
      disableTimeOut: true,
      positionClass: 'toast-top-right',
    });

    this.service
      .predictInputFile(
        this.prediction.profileName,
        this.compound.input_file['result'],
        JSON.stringify(this.endpoints),
        JSON.stringify(this.versions)
      )
      .subscribe(
        (result) => {
          if (result) {
            console.log(result);
            this.toastr.clear();
            this.commonService.setPredictionExec(true);
            this.toastr.success(
              this.compound.input_file['name'],
              'PREDICTION COMPLETED',
              {
                timeOut: 4000,
                positionClass: 'toast-top-right',
                progressBar: true,
              }
            );
          }
        },
        (error) => {
          console.log('error');
        }
      );
  }
  
  // TO DO
  predictInputList() {
    this.filterModels();
    this.service.predictInputList(
      this.prediction.profileName,
      this.compound.input_list['result'],
      this.compound.input_list['name'],
      JSON.stringify(this.endpoints),
      JSON.stringify(this.versions)
    ).subscribe(result => {
      console.log(result)
    },error => {
      console.log('error');
    });
  }

  filterModels() {
    this.endpoints = [];
    this.versions = [];
    this.model.listModelsSelected.filter((model) =>
      this.endpoints.push(model.name)
    );
    this.model.listModelsSelected.filter((model) =>
      this.versions.push(model.version)
    );
  }
}
