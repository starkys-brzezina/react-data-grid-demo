import * as React from 'react';
import { ColumnList } from 'react-data-grid';
import 'react-data-grid/dist/react-data-grid.css';
import AppStore from './AppStore';
import { observer } from 'mobx-react';
import { Grid, TextFilterRenderer, NumberFilterRenderer } from 'pd-components';

@observer
class App extends React.Component<any, any> {
  store = new AppStore();

  columns: ColumnList = [
    {
      key: "id",
      name: "ID",
      width: 50,
      draggable: true,
      resizable: true,
      filterable: true,
      sortable: true,
      filterRenderer: NumberFilterRenderer
    },
    {
      key: "title",
      name: "Title",
      draggable: true,
      resizable: true,
      filterable: true,
      sortable: true,
      filterRenderer: TextFilterRenderer
    },
    {
      key: "count",
      name: "Count",
      draggable: true,
      resizable: true,
      filterable: true,
      sortable: true,
      filterRenderer: NumberFilterRenderer
    }
  ];

  render() {
    return (
      <>
        <Grid
          columns={this.columns}
          rows={this.store.createRows()}
        />
      </>
    );
  }
}

export default App;
