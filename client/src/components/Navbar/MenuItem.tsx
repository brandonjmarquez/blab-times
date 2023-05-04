import { useEffect, useRef, useState } from 'react';
import Dropdown from './Dropdown';

const MenuItem = ({ className, depthLevel, items }: any) => {
  const [dropdown, setDropdown] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  const dropped = dropdown ? "rounded-bl-md rounded-br-none" : "";
  const undropped = depthLevel === 0 ? "rounded-md" : "";
  const undroppedLevel1 = depthLevel === 1 && !dropdown ? "rounded-md rounded-tr-none" : "";

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
    <li ref={ref} className={`relative ${className}`}>
      {items.submenu ? (
        <>
          <button 
            className={`inline-flex items-center text-custom-200 bg-custom-300 hover:bg-green-300 w-full p-3 ${dropped} ${undropped} ${undroppedLevel1}`}
            type="button"
            aria-haspopup="menu"
            aria-expanded={dropdown ? "true" : "false"}
            onClick={() => setDropdown((prev) => !prev)}
          >
            {items.title}{' '}
          </button>
          <Dropdown depthLevel={depthLevel} dropdown={dropdown} submenus={items.submenu} />
        </>
      ) : (
        <button onClick={() => items.target ? window.open(items.url) : location.href=items.url} className="text-custom-200 bg-custom-300 hover:bg-green-300 w-full p-3 text-start">{items.title}</button>
        // <button onClick={() => location.href=items.url} target={items.target ? items.target : "_self"} className="bg-custom-300 hover:bg-green-300 p-3 rounded-md">{items.title}</button>
      )}
    </li>
  )
}

export default MenuItem;