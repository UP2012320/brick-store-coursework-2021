import createSidebar from 'Scripts/components/layout/staff/sidebar';
import createRouter from 'Scripts/createRouter';
import htmlx from 'Scripts/htmlX';
import createNotFound from 'Scripts/pages/notFound';
import protectedPageStyles from 'Scripts/pages/protectedPage/protectedPage.module.scss';
import createManageProducts from 'Scripts/pages/staff/manageProducts/manageProducts';
import {createElementWithStyles} from 'Scripts/uiUtils';

export default function createStaff () {
  const container = createElementWithStyles('div', undefined, protectedPageStyles.messageContainer);

  const sidebar = createSidebar({
    options: [
      {
        href: '/staff/manage-products',
        title: 'Products',
      },
    ],
    title: 'Management Tools',
  });

  const [targetedRoute, restArgs, queryStrings] = createRouter([
    {
      name: 'products',
      route: '/staff/manage-products',
    },
    {
      name: 'main',
      route: '/staff',
    },
  ]);

  let page;

  switch (targetedRoute) {
    case 'main':
    case 'products':
      page = createManageProducts();
      break;
    default:
      page = createNotFound();
  }

  const body = createElementWithStyles('div', undefined, protectedPageStyles.bodyContainer);

  return htmlx`
    <${container}>
      <${sidebar}/>
      <${body}>
        <${page}/>
      </${body}>
    </container>
    `;
}
