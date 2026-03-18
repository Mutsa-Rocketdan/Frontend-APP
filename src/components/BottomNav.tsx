import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { id: 'home', to: '/', icon: 'home', label: '홈' },
  { id: 'study', to: '/curriculum', icon: 'menu_book', label: '학습' },
  { id: 'community', to: '#', icon: 'group', label: '커뮤니티' },
  { id: 'profile', to: '/profile', icon: 'person', label: '마이' },
];

interface Props {
  active?: string;
}

export const BottomNav = ({ active }: Props) => {
  const { pathname } = useLocation();
  const resolveActive = (item: typeof NAV_ITEMS[0]) => {
    if (active) return active === item.id;
    if (item.to === '/') return pathname === '/';
    return pathname.startsWith(item.to);
  };

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 bg-white/95 backdrop-blur-sm border-t border-[#E9E1D6] px-2 pb-6 pt-2 flex">
      {NAV_ITEMS.map((item) => {
        const on = resolveActive(item);
        return (
          <Link
            key={item.id}
            to={item.to}
            className="flex-1 flex flex-col items-center gap-1 py-1"
          >
            <span
              className={`material-symbols-outlined text-[24px] transition-colors ${on ? 'text-[#FF6A00]' : 'text-[#C4B8AA]'}`}
              style={{ fontVariationSettings: on ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <p className={`text-[10px] leading-none transition-colors ${on ? 'font-medium text-[#6F6A64]' : 'font-normal text-[#C4B8AA]'}`}>
              {item.label}
            </p>
          </Link>
        );
      })}
    </nav>
  );
};
