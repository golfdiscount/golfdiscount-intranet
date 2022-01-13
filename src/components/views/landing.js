// Landing page of the application
import SideNavbar from '../navigation/Side-Navbar';

function Landing() {
  const tabs = [
    {text: 'WSI Order Viewer', route: '/wsi'},
    {text: 'WSI Order Creator', route:'/wsi/order-creator'}
  ]
  return (
    <main>
      <SideNavbar tabs={tabs} header='Quick Links'/>
      <div className='tab-content tab-inner-content'>
        <h1>Golf Discount Intranet</h1>
        <section>
          <h2>Overview</h2>
          <p>
            This Intranet provides access to implementation of internal Golf Discount.
            These resources include WSI order creation and other commonly used utilities.
          </p>
        </section>
        <section>
          <h2>Change Log</h2>
          <ul>
            <li>Added quick links to landing page</li>
            <li>Added WSI order creation and order search</li>
          </ul>
        </section>
        <section>
          <h2>Upcoming Changes</h2>
          <ul>
            <li>Authentication</li>
            <li>Excel spreadsheet joiner</li>
            <li>Magento integration</li>
            <li>Business analytics platform</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

export default Landing;