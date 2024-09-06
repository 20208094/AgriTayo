import { NavLink } from 'react-router-dom';

const SidebarItem = ({ to, icon: Icon, text, onClick, isButton }) => {
  const Component = isButton ? 'button' : NavLink;
  return (
    <Component to={to} className="sidebar-item" onClick={onClick}>
      <Icon className="sidebar-icon" />
      <span className="sidebar-text">{text}</span>
    </Component>
  );
};

export default SidebarItem;
