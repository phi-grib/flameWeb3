import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { Model, Globals,Compound } from '../Globals';
@Component({
  selector: 'app-compounds',
  templateUrl: './compounds.component.html',
  styleUrls: ['./compounds.component.scss']
})
export class CompoundsComponent implements OnInit {

  constructor(private commonService: CommonService) { }


  ngOnInit(): void {
 
  }
  currentTab(event){
   this.commonService.currentCompoundTab.emit(event.target.id);
  }

}
