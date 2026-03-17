import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLectures, createLecture } from '../api/lectures';
import { useTaskPoller } from '../hooks/useTaskPoller';
import { ProgressBar } from '../components/ProgressBar';
import type { LectureResponse } from '../types';

const TaskProgressModal = ({ taskId, onDone }: { taskId: string; onDone: () => void }) => {
  const task = useTaskPoller(taskId);

  useEffect(() => {
    if (task?.status === 'completed') {
      setTimeout(onDone, 800);
    }
  }, [task?.status, onDone]);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 w-full max-w-sm text-center">
        <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white font-semibold mb-1">AI가 개념을 추출하고 있어요</p>
        <p className="text-zinc-400 text-sm mb-6">잠시만 기다려주세요...</p>
        <ProgressBar progress={task?.progress ?? 0} />
        {task?.status === 'failed' && (
          <p className="text-red-400 text-sm mt-4">처리 중 오류가 발생했습니다.</p>
        )}
      </div>
    </div>
  );
};

const CreateLectureModal = ({ onClose, onCreated }: { onClose: () => void; onCreated: (taskId: string) => void }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createLecture({ title, content });
      if (res.data.task_id) {
        onCreated(res.data.task_id);
      } else {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-lg">
        <h3 className="text-white text-lg font-semibold mb-6">강의 자료 등록</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-zinc-400 text-sm mb-2">강의 제목</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="예: 1주차 - 자연어처리 기초"
              className="w-full bg-zinc-800 border border-zinc-700 focus:border-orange-500 text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-zinc-400 text-sm mb-2">강의 내용 (스크립트)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={8}
              placeholder="강의 스크립트를 붙여넣으세요..."
              className="w-full bg-zinc-800 border border-zinc-700 focus:border-orange-500 text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-zinc-700 text-zinc-300 hover:border-zinc-500 py-3 rounded-lg text-sm transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-semibold py-3 rounded-lg text-sm transition-colors"
            >
              {loading ? '업로드 중...' : 'AI 분석 시작'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const LecturesPage = () => {
  const [lectures, setLectures] = useState<LectureResponse[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [pollingTaskId, setPollingTaskId] = useState<string | undefined>();
  const navigate = useNavigate();

  const fetchLectures = async () => {
    const res = await getLectures();
    setLectures(res.data);
  };

  useEffect(() => { fetchLectures(); }, []);

  const handleCreated = (taskId: string) => {
    setShowCreate(false);
    setPollingTaskId(taskId);
  };

  const handlePollDone = () => {
    setPollingTaskId(undefined);
    fetchLectures();
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {showCreate && (
        <CreateLectureModal onClose={() => setShowCreate(false)} onCreated={handleCreated} />
      )}
      {pollingTaskId && (
        <TaskProgressModal taskId={pollingTaskId} onDone={handlePollDone} />
      )}

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-2xl font-bold">내 강의 목록</h1>
            <p className="text-zinc-500 text-sm mt-1">강의 자료를 업로드하고 AI로 퀴즈를 생성하세요</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            + 강의 등록
          </button>
        </div>

        {lectures.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📚</p>
            <p className="text-zinc-400">아직 등록된 강의가 없어요</p>
            <p className="text-zinc-600 text-sm mt-1">강의 자료를 업로드하면 AI가 자동으로 분석해요</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {lectures.map((lecture) => (
              <div
                key={lecture.id}
                onClick={() => navigate(`/lectures/${lecture.id}`)}
                className="bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 rounded-xl p-6 cursor-pointer transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-semibold group-hover:text-orange-500 transition-colors">
                      {lecture.title}
                    </h3>
                    <p className="text-zinc-500 text-sm mt-1 line-clamp-2">{lecture.content}</p>
                  </div>
                  <span className="text-zinc-600 text-xs ml-4 shrink-0">
                    {new Date(lecture.created_at).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
