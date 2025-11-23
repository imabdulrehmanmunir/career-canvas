import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Plus, Trash2, Briefcase, CheckCircle, Clock } from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) navigate('/login');
    else fetchJobs();
  }, [user, navigate]);

  const fetchJobs = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.get('https://career-canvas-qtnw.onrender.com/api/jobs', config);
      setJobs(response.data);
    } catch {
      toast.error('Failed to fetch jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await axios.post(
        'https://career-canvas-qtnw.onrender.com/api/jobs',
        { company, position },
        config
      );

      setJobs([...jobs, response.data]);
      setCompany('');
      setPosition('');
      toast.success('Job Added!');
    } catch {
      toast.error('Error adding job');
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`https://career-canvas-qtnw.onrender.com/api/jobs/${id}`, config);

      setJobs(jobs.filter((job) => job._id !== id));
      toast.success('Deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await axios.put(
        `https://career-canvas-qtnw.onrender.com/api/jobs/${id}`,
        { status: newStatus },
        config
      );

      setJobs(jobs.map((job) => (job._id === id ? response.data : job)));
    } catch {
      toast.error('Update failed');
    }
  };

  const getJobsByStatus = (status) => jobs.filter((job) => job.status === status);

  if (isLoading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 text-center md:text-left">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">CareerCanvas</h1>
            <p className="text-slate-500">Welcome back, {user && user.name}</p>
          </div>
          <button 
            onClick={() => { localStorage.removeItem('user'); navigate('/login'); }} 
            className="bg-white text-slate-600 px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100"
          >
            Logout
          </button>
        </header>

        {/* Add Job Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <form 
            onSubmit={onSubmit} 
            className="flex flex-col md:flex-row gap-4 items-stretch md:items-end"
          >
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
              <input 
                value={company} 
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Google"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Position</label>
              <input 
                value={position} 
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g. Frontend Developer"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            <button 
              type="submit" 
              className="w-full md:w-auto bg-violet-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-violet-700 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" /> Add Application
            </button>
          </form>
        </div>

        {/* Kanban */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <KanbanColumn 
            title="Applied"
            count={getJobsByStatus('Applied').length}
            icon={<Briefcase className="w-5 h-5" />}
            bg="bg-slate-100"
            jobs={getJobsByStatus('Applied')}
            deleteJob={deleteJob}
            updateStatus={updateStatus}
          />

          <KanbanColumn 
            title="Interviewing"
            count={getJobsByStatus('Interviewing').length}
            icon={<Clock className="w-5 h-5" />}
            bg="bg-violet-50"
            jobs={getJobsByStatus('Interviewing')}
            deleteJob={deleteJob}
            updateStatus={updateStatus}
          />

          <KanbanColumn 
            title="Offers"
            count={getJobsByStatus('Offer').length}
            icon={<CheckCircle className="w-5 h-5" />}
            bg="bg-emerald-50"
            jobs={getJobsByStatus('Offer')}
            deleteJob={deleteJob}
            updateStatus={updateStatus}
          />

        </div>
      </div>
    </div>
  );
}

const KanbanColumn = ({ title, count, icon, bg, jobs, deleteJob, updateStatus }) => (
  <div className={`${bg} p-4 rounded-xl max-h-[70vh] overflow-y-auto`}>
    <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
      {icon} {title} ({count})
    </h3>
    <div className="space-y-3">
      {jobs.map(job => (
        <JobCard key={job._id} job={job} deleteJob={deleteJob} updateStatus={updateStatus} />
      ))}
    </div>
  </div>
);

const JobCard = ({ job, deleteJob, updateStatus }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 group hover:shadow-md transition-all">
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-bold text-slate-800">{job.company}</h4>
        <p className="text-sm text-slate-500">{job.position}</p>
      </div>
      <button 
        onClick={() => deleteJob(job._id)} 
        className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>

    <div className="mt-4 flex flex-wrap gap-2 text-xs">
      {job.status !== 'Applied' && (
        <button onClick={() => updateStatus(job._id, 'Applied')} className="px-2 py-1 bg-slate-100 rounded">
          Move to Applied
        </button>
      )}
      {job.status !== 'Interviewing' && (
        <button onClick={() => updateStatus(job._id, 'Interviewing')} className="px-2 py-1 bg-violet-100 text-violet-700 rounded">
          Interview
        </button>
      )}
      {job.status !== 'Offer' && (
        <button onClick={() => updateStatus(job._id, 'Offer')} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded">
          Offer!
        </button>
      )}
    </div>
  </div>
);

export default Dashboard;
