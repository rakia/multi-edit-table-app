import { Component                           } from '@angular/core';
import { Column, EditedRows, PeriodicElement } from '../../projects/multi-edit-table/src/lib/multi-edit-table.component';

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1 , name: 'Hydrogen' , weight: 1.0079 , symbol: 'H'  },
  { position: 2 , name: 'Helium'   , weight: 4.0026 , symbol: 'He' },
  { position: 3 , name: 'Lithium'  , weight: 6.941  , symbol: 'Li' },
  { position: 4 , name: 'Beryllium', weight: 9.0122 , symbol: 'Be' },
  { position: 5 , name: 'Boron'    , weight: 10.811 , symbol: 'B'  },
  { position: 6 , name: 'Carbon'   , weight: 12.0107, symbol: 'C'  },
  { position: 7 , name: 'Nitrogen' , weight: 14.0067, symbol: 'N'  },
  { position: 8 , name: 'Oxygen'   , weight: 15.9994, symbol: 'O'  },
  { position: 9 , name: 'Fluorine' , weight: 18.9984, symbol: 'F'  },
  { position: 10, name: 'Neon'     , weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  dataSource        = ELEMENT_DATA;
  columns: Column[] = [
    {col: 'position', label: 'Pos'   , editable: false},
    {col: 'name'    , label: 'Name'  , editable: true },
    {col: 'weight'  , label: 'Weight', editable: true },
    {col: 'symbol'  , label: 'Symbol', editable: true }
  ];
  unsavedDataSource: boolean = false;

  constructor() {}

  afterUpdateSelectedCells(event) {
    if(!this.unsavedDataSource) {
      this.unsavedDataSource = true;
    }
  }

  /**
   * @param event
   */
  updateDependingColumns(event: EditedRows) {
    const dataCopy: PeriodicElement[] = this.dataSource.slice(); // copy and mutate
    // update other columns after user edited table's data
    for (let i = event.startRow; i <= event.endRow; i++) {
      // something todo if it's needed
    }
    this.dataSource = dataCopy;
  }

  afterDelete(event) {
    console.log('after delete');
  }
}
