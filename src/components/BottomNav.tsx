import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { id: 'home',      to: '/',          icon: 'home',      label: '홈' },
  { id: 'study',     to: '/curriculum', icon: 'menu_book', label: '학습' },
  { id: 'community', to: '#',           icon: 'group',     label: '커뮤니티' },
  { id: 'profile',   to: '/profile',    icon: 'person',    label: '마이' },
];

export const BottomNav = ({ active }: { active?: string }) => {
  const { pathname } = useLocation();
  const resolveActive = (item: typeof NAV_ITEMS[0]) => {
    if (active) return active === item.id;
    if (item.to === '/') return pathname === '/';
    return pathname.startsWith(item.to);
  };

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app z-50 bg-white border-t border-[#E5E3DE] px-2 pb-6 pt-2 flex">
      {NAV_ITEMS.map((item) => {
        const on = resolveActive(item);
        return (
          <Link
            key={item.id}
            to={item.to}
            className={`flex flex-1 flex-col items-center justify-center gap-1 pt-1 transition-colors relative ${on ? 'text-primary' : 'text-slate-400'}`}
          >
            {on && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-primary rounded-full" />
            )}
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: on ? "'FILL' 1, 'wght' 500" : "'FILL' 0, 'wght' 400" }}
            >
              {item.icon}
            </span>
            <p className="text-[9px] font-semibold uppercase tracking-wide leading-none">{item.label}</p>
          </Link>
        );
      })}
    </nav>
  );
};
