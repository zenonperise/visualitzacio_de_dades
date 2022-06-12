import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { reducer } from './data/reducer';
import { EffectsModule } from '@ngrx/effects';
import {HttpClientModule} from '@angular/common/http'
import { EffectsService } from './data/effects.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './components/main/main.component';
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatIconModule} from '@angular/material/icon'
import {MatButtonModule} from '@angular/material/button'
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card'
import {MatListModule} from '@angular/material/list'
import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatSlideToggleModule} from '@angular/material/slide-toggle'
import { GeneralGraphicComponent } from './components/general-graphic/general-graphic.component';
import { MainGraphicComponent } from './components/main-graphic/main-graphic.component';
import { ProjectTypeGraphicComponent } from './components/project-type-graphic/project-type-graphic.component';
import { SelectedSprintsCardComponent } from './components/selected-sprints-card/selected-sprints-card.component';
import { FilterProjectTypeCardComponent } from './components/filter-project-type-card/filter-project-type-card.component';
import { DurationPipe } from './data/duration.pipe';
import { AbsoluteRelativeModeCardComponent } from './components/absolute-relative-mode-card/absolute-relative-mode-card.component';
import { InternalComponentsGraphicComponent } from './components/internal-components-graphic/internal-components-graphic.component';
import { FilterProjectCardComponent } from './components/filter-project-card/filter-project-card.component';
import { EstimationMainComponent } from './components/estimation-main/estimation-main.component';
import { EstimationInfoCardComponent } from './components/estimation-info-card/estimation-info-card.component'


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    GeneralGraphicComponent,
    MainGraphicComponent,
    ProjectTypeGraphicComponent,
    SelectedSprintsCardComponent,
    FilterProjectTypeCardComponent,
    DurationPipe,
    AbsoluteRelativeModeCardComponent,
    InternalComponentsGraphicComponent,
    FilterProjectCardComponent,
    EstimationMainComponent,
    EstimationInfoCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({data: reducer}),
    EffectsModule.forRoot([EffectsService]),
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule, 
    MatButtonModule, 
    MatSidenavModule,
    MatTabsModule,
    MatCardModule, 
    MatListModule,
    MatCheckboxModule, 
    MatSlideToggleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
