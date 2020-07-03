 import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
 import { MatSnackBar } from "@angular/material/snack-bar";

  export interface MouseEvent {
    rowId:     number;
    colId:     number;
    cellsType: string;
  }

  export interface PeriodicElement {
    name:     string;
    position: number;
    weight:   number;
    symbol:   string;
  }

 export interface EditedRows {
   startRow: number;
   endRow:   number;
 }

 export interface EditedCell {
   rowId:     number;
   colId:     number;
   cellsType: string;
   newValue:  string;
 }

 export interface Column {
   col:       string;
   label:     string;
   editable?: boolean;
   sum?:      number;
 }

 const ELEMENT_DATA: PeriodicElement[] = [
    {position: 1 , name: 'Hydrogen' , weight: 1.0079 , symbol: 'H' },
    {position: 2 , name: 'Helium'   , weight: 4.0026 , symbol: 'He'},
    {position: 3 , name: 'Lithium'  , weight: 6.941  , symbol: 'Li'},
    {position: 4 , name: 'Beryllium', weight: 9.0122 , symbol: 'Be'},
    {position: 5 , name: 'Boron'    , weight: 10.811 , symbol: 'B' },
    {position: 6 , name: 'Carbon'   , weight: 12.0107, symbol: 'C' },
    {position: 7 , name: 'Nitrogen' , weight: 14.0067, symbol: 'N' },
    {position: 8 , name: 'Oxygen'   , weight: 15.9994, symbol: 'O' },
    {position: 9 , name: 'Fluorine' , weight: 18.9984, symbol: 'F' },
    {position: 10, name: 'Neon'     , weight: 20.1797, symbol: 'Ne'},
 ];

@Component({
  selector: 'lib-multi-edit-table',
  templateUrl: './multi-edit-table.component.html',
  styleUrls: ['./multi-edit-table.component.scss']
})
export class MultiEditTableComponent implements OnInit, OnChanges {

    @Input()  dataSource;
    @Input()  columns: Column[];
    @Output() updateWidgetState      = new EventEmitter<void>();
    @Output() updateDependingColumns = new EventEmitter<EditedRows>();
    @Output() afterDelete            = new EventEmitter<void>();
    displayedColumns: string[];

    tableMouseDown:     MouseEvent;
    tableMouseUp:       MouseEvent;
    FIRST_EDITABLE_ROW: number = 0;
    LAST_EDITABLE_ROW:  number = ELEMENT_DATA.length - 1; // = 9
    FIRST_EDITABLE_COL: number = 1;                       // first column pos is not editable --> so start from index 1
    LAST_EDITABLE_COL:  number; // = this.displayedColumns.length - 1; // = 3
    newCellValue:       string = '';

    /**
     * NOTE: nbRows    of selectedCellsState must = nbRows of the tabl
     * nbColumns of selectedCellsState must = nbColumns of all selectable cells in the table
     */
    selectedCellsState: boolean[][] = [
      [false, false, false],
      [false, false, false],
      [false, false, false],
      [false, false, false],
      [false, false, false],
      [false, false, false],
      [false, false, false],
      [false, false, false],
      [false, false, false],
      [false, false, false]
    ];

    constructor(public snackBar: MatSnackBar) {}

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges): void {
      if(changes.columns) {
        this.displayedColumns  = this.columns.map((column: Column) => column.col );
        this.LAST_EDITABLE_COL = this.displayedColumns.length - 1;
      }
    }

    /**
     * Update table's dataSource
     * @param text
     */
    updateSelectedCellsValues(text: string) {

      if (text == null) { return; }

      if(this.tableMouseDown && this.tableMouseUp) {
        if(this.tableMouseDown.cellsType === this.tableMouseUp.cellsType) {

          const dataCopy: PeriodicElement[] = this.dataSource.slice(); // copy and mutate
          let startCol: number;
          let endCol:   number;
          let startRow: number;
          let endRow:   number;

          if(this.tableMouseDown.colId <= this.tableMouseUp.colId) {
            startCol = this.tableMouseDown.colId;
            endCol   = this.tableMouseUp.colId;
          } else {
            endCol   = this.tableMouseDown.colId;
            startCol = this.tableMouseUp.colId;
          }

          if(this.tableMouseDown.rowId <= this.tableMouseUp.rowId) {
            startRow = this.tableMouseDown.rowId;
            endRow   = this.tableMouseUp.rowId;
          } else {
            endRow   = this.tableMouseDown.rowId;
            startRow = this.tableMouseUp.rowId;
          }

          //--Edit cells from the same column
          if(startCol === endCol) {
            console.log('--Edit cells from the same column');
            for(let i = startRow; i <= endRow; i++) {
              dataCopy[i][this.displayedColumns[startCol]] = text;
            }
          } else {
            //--Edit cells starting and ending not on the same column
            console.log('--Edit cells starting and ending not on the same column');

            for(let i = startRow; i <= endRow; i++) {
              for(let j = startCol; j <= endCol; j++) {
                dataCopy[i][this.displayedColumns[j]] = text;
              }
            }
          }
          console.log('--update: ' + startRow + ', '+ startCol + ' to ' + endRow + ', '+ endCol);
          this.dataSource = dataCopy;

        } else {
          this.openSnackBar('The selected cells don\'t have the same type.', 'OK');
        }
      }
    }

    /**
     * @param rowId
     * @param colId
     * @param cellsType
     */
    onMouseDown(rowId: number, colId: number, cellsType: string) {

      this.tableMouseDown = {rowId: rowId, colId: colId, cellsType: cellsType};
    }

    /**
     * @param rowId
     * @param colId
     * @param cellsType
     */
    onMouseUp(rowId: number, colId: number, cellsType: string) {

      this.tableMouseUp = {rowId: rowId, colId: colId, cellsType: cellsType};
      if(this.tableMouseDown) {
        this.newCellValue = '';
        this.updateSelectedCellsState(this.tableMouseDown.colId, this.tableMouseUp.colId, this.tableMouseDown.rowId, this.tableMouseUp.rowId);
      }
    }

    /**
     * Update selectedCols && selectedRows arrays
     * @param mouseDownColId
     * @param mouseUpColId
     * @param mouseDownRowId
     * @param mouseUpRowId
     */
    private updateSelectedCellsState(mouseDownColId: number, mouseUpColId: number, mouseDownRowId: number, mouseUpRowId: number) {

      // init selected cells
      this.setSelectedCells(this.FIRST_EDITABLE_ROW, this.LAST_EDITABLE_ROW, this.FIRST_EDITABLE_COL, this.LAST_EDITABLE_COL, false);

      // update selected cells
      let startCol: number;
      let endCol:   number;
      let startRow: number;
      let endRow:   number;
      if (mouseDownColId <= mouseUpColId) {
        startCol = mouseDownColId;
        endCol   = mouseUpColId;
      } else {
        endCol   = mouseDownColId;
        startCol = mouseUpColId;
      }

      if (mouseDownRowId <= mouseUpRowId) {
        startRow = mouseDownRowId;
        endRow   = mouseUpRowId;
      } else {
        endRow   = mouseDownRowId;
        startRow = mouseUpRowId;
      }
      for (let i = startRow; i <= endRow; i++) {
        for (let j = startCol; j <= endCol; j++) {
          this.selectedCellsState[i][j] = true;
        }
      }
      this.setSelectedCells(startRow, endRow, startCol, endCol, true);
    }

   /**
    * @param firstEditableRow
    * @param lastEditableRow
    * @param firstEditableCol
    * @param lastEditableCol
    * @param value
    */
    private setSelectedCells(firstEditableRow: number, lastEditableRow: number, firstEditableCol: number, lastEditableCol: number, value: boolean) {

      for (let i = firstEditableRow; i <= lastEditableRow; i++) {
        for (let j = firstEditableCol; j <= lastEditableCol; j++) {
          this.selectedCellsState[i][j] = value;
        }
      }
    }

    /**
     * After the user enters a new value, all selected cells must be updated
     * document:keyup
     * @param event
     */
    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {

      // If no cell is selected then ignore keyUp event
      if(this.tableMouseDown && this.tableMouseUp) {

        if(event.key === 'Delete') {
          this.newCellValue = '';
          this.updateSelectedCellsValues(this.newCellValue);

        } else if(event.key === 'Backspace') { // 'delete' key is pressed
          const end: number = this.newCellValue.length - 1;
          this.newCellValue = this.newCellValue.slice(0, end);
          this.updateSelectedCellsValues(this.newCellValue);

        } else if(this.isNotSpecialKeys(event)) { // key is not specialKeys
          this.newCellValue += event.key;
          this.updateSelectedCellsValues(this.newCellValue);
        }
        if(event.key === 'Enter') {
          this.setSelectedCells(this.FIRST_EDITABLE_ROW, this.LAST_EDITABLE_ROW, this.FIRST_EDITABLE_COL, this.LAST_EDITABLE_COL, false);
        }
      }
    }

    /**
     * @param event
     */
     isNotSpecialKeys(event: KeyboardEvent): boolean {

       let specialKeys: string[] = ['Enter', 'PrintScreen', 'Escape', 'cControl', 'NumLock', 'PageUp', 'PageDown', 'End',
         'Home', 'Insert', 'ContextMenu', 'Control', 'ControlAltGraph', 'Alt', 'Meta', 'Shift', 'CapsLock',
         'TabTab', 'ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Pause', 'ScrollLock', 'Dead', '',
         'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];

       return this.indexOfInArray(event.key, specialKeys) === -1;
    }

    indexOfInArray(item: string, array: string[]): number {
      let index: number = -1;
      for (let i = 0; i < array.length; i++) {
        if (array[i] === item) { index = i; }
      }
      return index;
    }

    /**
     * @param message
     * @param action
     */
    openSnackBar(message: string, action: string) {
      this.snackBar.open(message, action, { duration: 4000 });
    }
  }
