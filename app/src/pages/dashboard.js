import Databaselist from '../component/database_list';
import Databasetable from '../component/database_table';
import Query from '../component/query';
import Table from '../component/table_content';
import ImportDB from '../component/importDB';
import React, { useState } from 'react';

export default function Dashboard() {
  const [currentComponent, setCurrentComponent] = useState('Table');

  const renderComponent = () => {
    switch (currentComponent) {
      case 'Table':
        return <Table />;
      case 'Sql':
        return <Query />;
      case 'Import':
        return <ImportDB />;
      default:
        return <Table />;
    }
  };

  const renderComp = (component) => {
    setCurrentComponent(component);
  };

  return (
    <>
      <div className='dashboard_parent'>
        <div className='dashboard_data'>
          <div className='connection_container'>
            <h4 className='host'>Connection: {sessionStorage.getItem('user') + '@' + sessionStorage.getItem('host')}</h4>
          </div>
        </div>
        <div className='dashboard_view'>
          <div className='dashboard_left'>
            <Databaselist />
            <Databasetable />
            <div>
              <div className='module_container'>
                <p className='database_list_element' onClick={() => renderComp("Table")}>Table view</p>
                <p className='database_list_element' onClick={() => renderComp("Sql")}>SQL</p>
                <p className='database_list_element' onClick={() => renderComp("Import")}>Import</p>
              </div>
            </div>
          </div>
          <div className='dashboard_right'>
            {/* Add your table data or other components here */}
            {renderComponent()}
          </div>
        </div>
      </div>
    </>
  );
}
