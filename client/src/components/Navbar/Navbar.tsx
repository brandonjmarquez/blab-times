import { menuItems } from './menuItems';
import MenuItem from './MenuItem';

const Navbar = () => {
  return (
    <nav>
      <ul className="flex items-center flex-wrap list-none px-3">{
        menuItems.map((menu, index) => {
          return <MenuItem items={menu} key={index} />
        })
      }</ul>
    </nav>
  );
};

export default Navbar;