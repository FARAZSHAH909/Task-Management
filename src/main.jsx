import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/Login.jsx';
import Users from './components/Users.jsx';
import Tasks from './components/Tasks.jsx';
import Workspaces from './components/workspaces.jsx';
import Projects from './components/Projects.jsx';
import PublicRepos from './components/PublicRepos.jsx';
import Dashboard from './components/DashBoard.jsx';


import { Provider } from 'react-redux';
import { store } from "../src/store/store.js"
import RepoViewer from './components/RepoViewer.jsx';
import TaskDetail from './components/TaskDetail.jsx';
import ProjectDetail from './components/ProjectDetail.jsx';
import WorkspaceDetail from './components/Detailworkspace.jsx';
import PageNotFound from './components/404.jsx';

const route = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Dashboard />
      },
      {
        path: "/users",
        element: <Users />
      },
      {
        path: "/tasks",
        element: <Tasks />
      },
      {
        path: "/workspaces",
        element: <Workspaces />
      },
      {
        path: "/workspaces/:id",
        element: <WorkspaceDetail />
      },
      {
        path: "/projects",
        element: <Projects />
      },
      {
        path: "/projects/:id",
        element: <ProjectDetail />
      },
      {
        path: "/public-repos",
        element: <PublicRepos />
      }, {
        path: "/repo/:id",
        element: <RepoViewer />
      }
      , {
        path: "/task/:id",
        element: <TaskDetail />
      }
    ]

  },
  {
    path: "/login",
    element: <Login />
  }, {
    path: "*",
    element: <PageNotFound />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={route} />
    </Provider>
  </StrictMode>,
)
