import { menuItems } from './menuItems';
import { menuItemsCollapsed } from './menuItemsCollapsed';
import MenuItem from './MenuItem';

interface Props {
  collapsed: boolean;
}

const Navbar = (props: Props) => {
  const depthLevel = 0;
  return (
      <ul className="flex items-center justify-between flex-wrap list-none px-3">
        {
          props.collapsed ?
            menuItemsCollapsed.map((menu, index) => {
              return <MenuItem className="" depthLevel={depthLevel} items={menu} key={index} />
            })
            :
            menuItems.map((menu, index) => {
              return <MenuItem className="" depthLevel={depthLevel} items={menu} key={index} />
            })
        }
      </ul>
  );
};

export default Navbar;