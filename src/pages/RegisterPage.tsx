import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { LikelionLogo } from '../components/LikelionLogo';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agreed) { setError('이용약관에 동의해주세요.'); return; }
    setError('');
    setLoading(true);
    try {
      await register(email, password, name);
      navigate('/login');
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(detail === 'Email already registered' ? '이미 사용 중인 이메일입니다.' : '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container min-h-screen bg-gradient-to-br from-white via-[#FFFAF7] to-[#FFF4EE] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 pt-14 pb-2">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center text-[#1A1A1A]">
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </button>
        <div className="flex items-center gap-2">
          <LikelionLogo size="sm" iconOnly />
          <span className="text-[#FF6A00] font-bold text-[15px] tracking-tight">멋쟁이사자처럼</span>
        </div>
        <div className="w-10" />
      </div>

      {/* Main content */}
      <main className="px-6 pt-10 pb-10 flex-1 flex flex-col">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-[28px] font-bold leading-[1.3] tracking-[-0.02em] text-[#1A1A1A] mb-1.5">
            새로운 학습 시작하기
          </h1>
          <p className="text-[14px] text-[#8C8784] leading-[1.6]">프리미엄 AI 복습 엔진과 함께하세요</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="px-4 py-3 bg-[#A05540]/8 border border-[#A05540]/20 rounded-lg text-[#A05540] text-[13px]">
              {error}
            </div>
          )}

          <div className="flex flex-col">
            <label className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9C9894] ml-0.5 mb-1.5">
              이름
            </label>
            <input
              type="text"
              placeholder="성함을 입력해주세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-[52px] w-full rounded-lg border border-[#E0DDD8] bg-white px-4 text-[14px] text-[#1A1A1A] placeholder:text-[#C0BCB7] focus:outline-none focus:border-[#FF6A00] focus:ring-2 focus:ring-[#FF6A00]/10 transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9C9894] ml-0.5 mb-1.5">
              이메일
            </label>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-[52px] w-full rounded-lg border border-[#E0DDD8] bg-white px-4 text-[14px] text-[#1A1A1A] placeholder:text-[#C0BCB7] focus:outline-none focus:border-[#FF6A00] focus:ring-2 focus:ring-[#FF6A00]/10 transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9C9894] ml-0.5 mb-1.5">
              비밀번호
            </label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="8자 이상의 영문, 숫자 조합"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="h-[52px] w-full rounded-lg border border-[#E0DDD8] bg-white px-4 pr-12 text-[14px] text-[#1A1A1A] placeholder:text-[#C0BCB7] focus:outline-none focus:border-[#FF6A00] focus:ring-2 focus:ring-[#FF6A00]/10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C0BCB7] hover:text-[#8C8784] transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPw ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Terms checkbox */}
          <label className="flex items-start gap-3 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 rounded border-[#E0DDD8] cursor-pointer accent-[#FF6A00]"
            />
            <p className="text-[12px] text-[#8C8784] leading-relaxed">
              서비스 이용약관 및 개인정보 처리방침에 동의합니다.
            </p>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full h-[52px] bg-[#FF6A00] hover:bg-[#E05E00] text-white font-semibold text-[15px] rounded-lg shadow-[0_4px_16px_rgba(255,106,0,0.22)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? '가입 중...' : '회원가입 완료'}</span>
            {!loading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
          </button>
        </form>

        {/* Bottom link */}
        <div className="mt-auto pt-8 text-center text-[12px] text-[#8C8784]">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-[#FF6A00] font-semibold">로그인</Link>
        </div>
      </main>
    </div>
  );
};
