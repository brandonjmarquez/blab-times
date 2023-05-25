import { useEffect, useRef, useState } from 'react';
import Dropdown from './Dropdown';

const MenuItem = ({ collapsed, liClassName, depthLevel, index, items, username }: any) => {
  const [dropdown, setDropdown] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  const burger = items.title === '☰' ? "text-2xl" : "";
  const depthIs0 = depthLevel === 0 ? "rounded-md mx-1 " : "";
  const dropped = !collapsed && dropdown && depthLevel === 0 ? "rounded-md rounded-br-none " : "";
  const droppedColl = collapsed && dropdown && depthLevel === 0 ? "rounded-md rounded-b-none " : "";
  const undroppedLevel0 = depthLevel === 0 && !dropdown ? "rounded-md " : "";
  const undroppedLevel1 = depthLevel === 1 && !dropdown ? "rounded-br-md " : "";
  const firstMenuItemLevel1 = collapsed && depthLevel === 1 && index === 0 ? "rounded-tl-md " : "";
  const lastMenuItemLevel1 = depthLevel === 1 && index === 4 ? "rounded-b-md " : "";
  const uncollLastMenuItemLevel1 = depthLevel === 1 && index === 3 && !collapsed ? "rounded-b-md " : "";
  const firstMenuItemLevel2 = depthLevel === 2 && index === 0 ? "rounded-tl-md " : "";
  const lastMenuItemLevel2 = depthLevel === 2 && index === 3 ? "rounded-b-md " : "";

  useEffect(() => {
    const clickHandler = (e: Event) => {
      if(dropdown && ref.current && !ref.current.contains(e.target as Node | null)) {
        setDropdown(false);
      }
    }

    document.addEventListener("mousedown", clickHandler)
    document.addEventListener("touchstart", clickHandler)

    return () => {
      document.removeEventListener("mousedown", clickHandler)
      document.removeEventListener("touchstart", clickHandler)
    }
  }, [dropdown]);

  return (
    <li ref={ref} className={`relative ${liClassName}`}>
      {items.submenu ? (
        <>
          <button 
            className={`inline-flex items-center text-custom-200 bg-custom-300 hover:bg-green-300 w-full p-3 ${dropped + droppedColl + undroppedLevel0 + undroppedLevel1 + burger}`}
            type="button"
            aria-haspopup="menu"
            aria-expanded={dropdown ? "true" : "false"}
            onClick={() => setDropdown((prev) => !prev)}
          >
            {items.title}{' '}
          </button>
          <Dropdown collapsed={collapsed} depthLevel={depthLevel} dropdown={dropdown} submenus={items.submenu} username={username} />
        </>
      ) : (
        <button onClick={() => items.target ? window.open(items.url) : location.href=items.url} className={`text-custom-200 bg-custom-300 hover:bg-green-300 w-full p-3 text-center ${firstMenuItemLevel1 + lastMenuItemLevel1 + firstMenuItemLevel2 + lastMenuItemLevel2 + depthIs0 + uncollLastMenuItemLevel1}`}>{items.title.includes('{username}') ? items.title.replace('{username}', username) : items.title}</button>
      )}
    </li>
  )
}

export default MenuItem;