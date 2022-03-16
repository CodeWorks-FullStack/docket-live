import { createRouter, createWebHashHistory } from 'vue-router'
import { authGuard, authSettled } from '@bcwdev/auth0provider-client'
import { AppState } from "./AppState"

function loadPage(page) {
  return () => import(`./pages/${page}.vue`)
}

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { title: "Home" },
    component: loadPage('HomePage')
  },
  {
    path: '/join',
    name: 'StudentLandingPage',
    meta: { title: "Student Page" },
    component: loadPage('StudentLandingPage'),
    beforeEnter: authGuard
  },
  {
    path: '/instructor',
    name: 'InstructorLandingPage',
    meta: { title: "Instructor Page" },
    component: loadPage('InstructorLandingPage'),
    beforeEnter: authGuard,
    children: [{
      path: 'surveys',
      name: 'SurveysPage',
      meta: { title: "Surveys" },
      component: loadPage('SurveysPage'),
      beforeEnter: authGuard
    }, {
      path: 'livePolls',
      name: 'LivePollsPage',
      meta: { title: "Live Polls" },
      component: loadPage('LivePollsPage'),
      beforeEnter: authGuard
    }, {
      path: 'results',
      name: 'ResultsPage',
      meta: { title: "Results" },
      component: loadPage('ResultsPage'),
      beforeEnter: authGuard
    }]
  },
  {
    path: '/account',
    name: 'Account',
    meta: { title: "Account" },
    component: loadPage('AccountPage'),
    beforeEnter: authGuard
  },
  {
    path: '/startLivePoll/:id',
    name: 'StartLivePollPage',
    meta: { title: "Start Poll" },
    component: loadPage('StartLivePollPage'),
    beforeEnter: authGuard
  },
  {
    path: '/startLivePoll/:id/question/:index',
    name: 'QuestionPage',
    meta: { title: "Questions" },
    component: loadPage('QuestionPage'),
    beforeEnter: authGuard
  }
]

export const router = createRouter({
  linkActiveClass: 'router-link-active',
  linkExactActiveClass: 'router-link-exact-active',
  history: createWebHashHistory(),
  routes
})

router.afterEach((to) => {
  let title = 'Docket.Live | '
  if (to.name == "Account") {
    title += AppState.account.name
  } else {
    title += to.meta.title
  }
  document.title = title
})
