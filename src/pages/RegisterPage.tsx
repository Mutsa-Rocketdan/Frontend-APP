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
    <div className="app-container bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="w-11 h-11 flex items-center justify-start text-[#0D0D0D]"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <div className="flex items-center gap-2">
          <LikelionLogo size="sm" iconOnly className="h-7 w-auto" />
          <span className="font-bold text-base tracking-tight text-[#0D0D0D]">LIKELION</span>
        </div>
        <div className="w-11" />
      </div>

      {/* Heading */}
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-[32px] font-black tracking-tight text-[#0D0D0D] leading-tight">새로운 학습의 시작</h1>
        <p className="text-slate-400 text-base mt-2">멋쟁이사자처럼에서 성장을 시작하세요.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col flex-1 px-6 gap-4 pb-8">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0D0D0D]">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="성함을 입력해주세요"
              className="w-full rounded-lg border border-slate-300 bg-white h-14 px-4 text-slate-900 placeholder:text-slate-300 focus:border-[#FF6A00] outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0D0D0D]">이메일 *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@likelion.net"
              className="w-full rounded-lg border border-slate-300 bg-white h-14 px-4 text-slate-900 placeholder:text-slate-300 focus:border-[#FF6A00] outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0D0D0D]">비밀번호 *</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="8자 이상의 영문, 숫자 조합"
                className="w-full rounded-lg border border-slate-300 bg-white h-14 px-4 pr-12 text-slate-900 placeholder:text-slate-300 focus:border-[#FF6A00] outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPw ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Terms */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 rounded border-slate-300 text-primary focus:ring-primary"
          />
          <p className="text-xs text-slate-500 leading-relaxed">
            가입 시 멋쟁이사자처럼의{' '}
            <span className="text-primary underline cursor-pointer">이용약관</span> 및{' '}
            <span className="text-primary underline cursor-pointer">개인정보처리방침</span>에 동의하게 됩니다.
          </p>
        </label>

        {error && (
          <p className="text-sm text-red-500 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {error}
          </p>
        )}

        <div className="flex-1" />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FF6A00] hover:bg-primary-dark disabled:opacity-60 text-white font-bold py-4 rounded-lg text-base transition-all active:scale-[0.98]"
        >
          {loading ? '처리 중...' : '무료로 시작하기'}
        </button>

        <div className="flex items-center justify-center gap-2">
          <span className="text-slate-500 text-sm">이미 계정이 있으신가요?</span>
          <Link to="/login" className="text-primary text-sm font-bold">로그인</Link>
        </div>
      </form>
    </div>
  );
};
