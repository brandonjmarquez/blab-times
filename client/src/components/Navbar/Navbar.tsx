import { menuItems } from './menuItems';
import { menuItemsCollapsed } from './menuItemsCollapsed';
import MenuItem from './MenuItem';
import { useEffect, useState } from 'react';

interface Props {
  collapsed: boolean;
}

const Navbar = (props: Props) => {
  const depthLevel = 0;
  const [menu, setMenu] = useState<any>([...menuItems])
  const [menuCol, setMenuCol] = useState<any>([...menuItemsCollapsed])
  const [removedButton, setRemovedButton] = useState(false);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('jwt') === null ? false : true;
    if(!removedButton) {
      if(loggedIn) {
        // Remove "Login" button
        setMenu((menu: any) => {
          let state = [...menuItems];

          state.splice(5, 1);
          return state;
        });
        setMenuCol((menuCol: any) => {
          let state = [...menuCol];
          let submenu = state[0].submenu = state[0].submenu;
          
          submenu = submenu.filter((item: any) => item.loggedIn === true || item.loggedIn === undefined)
          state[0].submenu = submenu;
          return state;
        });
      } else {
        // Remove "Account" button
        setMenu((menu: any) => {
          let state = [...menuItems];

          state.splice(4, 1);
          return state;
        });
        console.log(menuCol)
        setMenuCol((menuCol: any) => {
          let state = [...menuCol];
          let submenu = state[0].submenu = state[0].submenu;
          
          submenu = submenu.filter((item: any) => item.loggedIn === false || item.loggedIn === undefined)
          state[0].submenu = submenu;
          return state;
        });
      }
      setRemovedButton(true);
    }
  }, []);

  return (
    <ul className="flex items-center justify-between flex-wrap list-none px-3">
      { menu && menuCol ?
        props.collapsed ?
          menuCol.map((menu: any, index: number) => {
            // console.log(index)
            return <MenuItem collapsed={props.collapsed} index={index} depthLevel={depthLevel} items={menu} key={index} />
          })
          :
          menu.map((menu: any, index: number) => {
            return <MenuItem collapsed={props.collapsed} index={index} depthLevel={depthLevel} items={menu} key={index} />
          }) : null
      }
    </ul>
  );
};

export default Navbar;