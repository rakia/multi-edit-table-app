import { BrowserModule                     } from '@angular/platform-browser';
import { BrowserAnimationsModule           } from '@angular/platform-browser/animations';
import { NgModule                          } from '@angular/core';
import { MatSnackBarModule                 } from '@angular/material/snack-bar';
import { MatTableModule                    } from '@angular/material/table';

import { MultiEditTableComponent           } from './multi-edit-table.component';

@NgModule({
  declarations: [ MultiEditTableComponent ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatSnackBarModule
  ],
  exports: [ MultiEditTableComponent ]
})
export class MultiEditTableModule {}
