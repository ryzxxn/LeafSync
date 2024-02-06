import Databaselist from '../component/database_list';
import Databasetable from '../component/database_table';

export default function Dashboard() {
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
            <Databasetable/>
          </div>
          <div className='dashboard_right'>
            {/* Add your table data or other components here */}
            <p>Table data</p>
          </div>
        </div>
      </div>
    </>
  );
}
