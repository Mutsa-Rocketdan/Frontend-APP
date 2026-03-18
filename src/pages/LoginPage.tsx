import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginApi } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { LikelionLogo } from '../components/LikelionLogo';

const ease = 'cubic-bezier(0.22,1,0.36,1)';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleDemoMode = () => { demoLogin(); navigate('/'); };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginApi(email, password);
      await login(res.data.access_token);
      navigate('/');
    } catch {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container min-h-screen flex flex-col relative overflow-hidden">

      {/* orb 1 — 우상단 코너 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,115,0,0.28) 0%, rgba(255,150,50,0.13) 45%, transparent 72%)', filter: 'blur(48px)', animation: 'orb-drift-a 22s ease-in-out infinite' }}
      />
      {/* orb 2 — 좌하단 코너 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-32 w-[380px] h-[380px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,100,0,0.08) 0%, rgba(255,140,40,0.03) 50%, transparent 75%)', filter: 'blur(50px)', animation: 'orb-drift-b 20s ease-in-out infinite' }}
      />

      {/* 상단 브랜드 — 가로 배치, 중앙 정렬 */}
      <div
        className="flex justify-center pt-12 pb-0"
        style={{ animation: `fade-up-in-sm 0.5s ${ease} both` }}
      >
        <div className="flex items-center gap-2.5">
          <LikelionLogo size="sm" iconOnly className="!h-[34px]" />
          <div className="flex flex-col justify-center gap-[3px]">
            <span className="text-[#FF6A00] font-bold text-[15px] tracking-[-0.01em] leading-none">멋쟁이사자처럼</span>
            <span
              className="text-[#C0B5AD] leading-none"
              style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 400, fontSize: '10px', letterSpacing: '0.12em' }}
            >
              AI 복습 서비스
            </span>
          </div>
        </div>
      </div>

      {/* 중앙 콘텐츠 블록 */}
      <div className="flex-1 flex flex-col justify-center px-6 gap-6">

        {/* 카피 + 사자 */}
        <div className="flex flex-col gap-5">
          <div className="relative flex flex-col gap-2">

            {/* 사자 — 헤드라인 우측 여백 */}
            <img
              src="/lion1.png"
              alt=""
              aria-hidden
              className="pointer-events-none select-none absolute right-4 top-2 h-[80px] w-auto object-contain"
              style={{ opacity: 0.42, filter: 'saturate(1.1)' }}
            />

            <h1
              className="text-[38px] font-semibold leading-[1.32] tracking-[-0.04em] pr-[2px]"
              style={{
                color: '#786E66',
                animation: `fade-up-in 0.62s ${ease} both`,
                animationDelay: '0.07s',
              }}
            >
              강의가 끝난 뒤,<br />복습은 더 쉽게
            </h1>
            <p
              className="text-[13px] text-[#A8A09A] leading-[1.55] tracking-[0.02em] text-center"
              style={{
                animation: `fade-up-in 0.62s ${ease} both`,
                animationDelay: '0.16s',
              }}
            >
              퀴즈와 학습 가이드를 자동으로 생성해 복습 흐름을 이어갑니다
            </p>
          </div>

          {/* 폼 */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 mx-1"
            style={{
              animation: `card-rise 0.68s ${ease} both`,
              animationDelay: '0.25s',
            }}
          >
            {error && (
              <div className="px-3.5 py-2.5 bg-[#FFF4EA] border border-[#F5C99A] rounded-xl text-[#CC5500] text-[13px]">
                {error}
              </div>
            )}

            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-[44px] w-full rounded-xl border border-[#DDD0C0] bg-[#FDFAF7] px-4 text-[14px] text-[#2C2018] placeholder:text-[#C0B8B0] focus:outline-none focus:border-[#FF6A00] focus:ring-2 focus:ring-[#FF6A00]/10 focus:bg-white transition-all"
            />

            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-[44px] w-full rounded-xl border border-[#DDD0C0] bg-[#FDFAF7] px-4 pr-11 text-[14px] text-[#2C2018] placeholder:text-[#C0B8B0] focus:outline-none focus:border-[#FF6A00] focus:ring-2 focus:ring-[#FF6A00]/10 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-0 top-0 h-full w-11 flex items-center justify-center text-[#C0B8B0] hover:text-[#8A8078] transition-colors"
              >
                <span className="material-symbols-outlined text-[19px] leading-none">
                  {showPw ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-press btn-cta-gradient mt-1 w-full h-[44px] text-white font-semibold text-[14px] rounded-xl shadow-[0_6px_24px_rgba(210,80,0,0.30)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? '로그인 중...' : '이메일로 시작하기'}</span>
              {!loading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
            </button>
          </form>
        </div>

        {/* 보조 링크 */}
        <div
          className="flex items-center justify-center gap-4 -mt-1"
          style={{
            animation: `fade-up-in-sm 0.5s ${ease} both`,
            animationDelay: '0.35s',
          }}
        >
          <button type="button" className="text-[12px] text-[#C4B8AA] hover:text-[#FF6A00] transition-colors py-1">
            비밀번호 찾기
          </button>
          <span className="w-px h-3 bg-[#E0D8D0]" />
          <Link to="/register" className="text-[12px] text-[#C4B8AA] hover:text-[#FF6A00] transition-colors py-1">
            회원가입
          </Link>
        </div>
      </div>

      {/* 데모 — 맨처음 버전 스타일 */}
      <div
        className="px-6 pb-7 pt-4 border-t border-[#EDE6DC]"
        style={{
          animation: `fade-up-in-sm 0.5s ${ease} both`,
          animationDelay: '0.44s',
        }}
      >
        <button
          onClick={handleDemoMode}
          className="btn-press w-full h-[46px] border border-[#E2D9CE] bg-white text-[#7C6E66] font-medium text-[14px] rounded-xl transition-all flex items-center justify-center gap-2 hover:bg-[#FFF4EA] hover:border-[#F5C99A]"
        >
          <span className="material-symbols-outlined text-[17px] text-[#FF6A00]">bolt</span>
          데모로 체험하기
        </button>
        <p className="mt-2 text-center text-[10px] text-[#C4B8AA]">
          로그인 시 이용약관 및 개인정보 처리방침에 동의합니다
        </p>
      </div>

    </div>
  );
};
