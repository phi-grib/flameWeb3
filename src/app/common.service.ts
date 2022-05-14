import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  //observables to communicate to components without parent-child or sibling relationship, on current values
  private currentCompoundTab = new Subject<string>();
  currentCompoundTab$ = this.currentCompoundTab.asObservable();
  private currentSelection = new Subject<{}>();
  currentSelection$ = this.currentSelection.asObservable();
  //communicates to the component in charge of displaying the prediction, which molecule should present 
  private molIndex = new Subject<number>();
  molIndex$= this.molIndex.asObservable();

  private isValidCompound = new BehaviorSubject<boolean>(false);
  isValidCompound$ = this.isValidCompound.asObservable();

  constructor(private http: HttpClient) {}
  /**
   * Retrives the list of all models form the server
   */
  getModelList(): Observable<any> {
    const url: string = environment.baseUrl_manage + 'models';
    return this.http.get(url);
  }

  getValidation(model: string, version: string): Observable<any> {
    const url: string =
      environment.baseUrl_manage +
      'model/' +
      model +
      '/version/' +
      version +
      '/validation';
    return this.http.get(url);
  }
  getDocumentation(
    modelName: string,
    modelVersion: string,
    oformat: string
  ): Observable<any> {
    const url: string =
      environment.baseUrl_manage +
      'model/' +
      modelName +
      '/version/' +
      modelVersion +
      '/oformat/' +
      oformat +
      '/documentation';
    return this.http.get(url);
  }

  getParameters(model: string, version: string): Observable<any> {
    const url: string =
      environment.baseUrl_manage +
      'model/' +
      model +
      '/version/' +
      version +
      '/parameters';
    return this.http.get(url);
  }

  getModel(model: string, version: string): Observable<any> {
    const url: string =
      environment.baseUrl_manage + 'model/' + model + '/version/' + version;
    return this.http.get(url);
  }
  setCurrentCompoundTab(compoundTab: string) {
    this.currentCompoundTab.next(compoundTab);
  }
  setCurrentSelection(selection: {}) {
    this.currentSelection.next(selection);
  }

  setMolIndex(molIndex: number){
    this.molIndex.next(molIndex)
  }
  setIsvalidCompound(valid: boolean){
    this.isValidCompound.next(valid);
  }
}
