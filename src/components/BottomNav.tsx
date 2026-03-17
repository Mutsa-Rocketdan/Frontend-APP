import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', icon: 'home', label: '홈' },
  { to: '/my-lectures', icon: 'school', label: '내 강의' },
  { to: '/quiz-results', icon: 'bar_chart', label: '학습현황' },
  { to: '/profile', icon: 'person', label: '마이페이지' },
];

export const BottomNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app bg-white border-t border-gray-100 z-50">
      <div className="flex">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.to || (item.to !== '/' && pathname.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              className="flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors"
            >
              <span
                className={`material-symbols-outlined text-[26px] transition-colors ${
                  active ? 'text-primary' : 'text-gray-400'
                }`}
                style={{ fontVariationSettings: active ? "'FILL' 1, 'wght' 500" : "'FILL' 0, 'wght' 400" }}
              >
                {item.icon}
              </span>
              <span className={`text-[10px] font-medium transition-colors ${active ? 'text-primary' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
