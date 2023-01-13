/**
 * Landing page of the application
 * @author Harmeet Singh
 */
import { React } from 'react';
import SideNavbar from 'components/SideBar/SideBar';

function Landing() {
  const tabs = [
    {text: 'WSI Order Viewer', route: '/wsi'},
    {text: 'WSI Order Creator', route:'/wsi/order-creator'}
  ];

  return (
    <main>
      <SideNavbar tabs={tabs} header='Quick Links'/>
      <div className='tab-content tab-inner-content'>
        <h1>Golf Discount Intranet</h1>
        <section>
          <h2>Overview</h2>
          <p>
            This Intranet provides access to implementation of internal Golf Discount resources.
            These resources include WSI order creation and other commonly used utilities.
          </p>
        </section>
      </div>
    </main>
  );
}

export default Landing;