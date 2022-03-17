<template>
  <span class="navbar-text">
    <button
      class="
        btn
        selectable
        text-success
        lighten-30
        text-uppercase
        my-2 my-lg-0
        text-dark
      "
      @click="login"
      v-if="!account.id"
    >
      Login
    </button>

    <div class="dropdown my-2 my-lg-0" v-else>
      <div
        class="dropdown-toggle selectable"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        id="authDropdown"
      >
        <img
          :src="account.picture"
          alt="user photo"
          height="40"
          class="profileImg"
        />
        <span class="mx-3 text-primary">{{ account.name }}</span>
      </div>
      <div
        class="dropdown-menu p-0 list-group w-100"
        aria-labelledby="authDropdown"
      >
        <router-link :to="{ name: 'Account' }">
          <div class="list-group-item list-group-item-action hoverable">
            Manage Account
          </div>
        </router-link>
        <div
          class="list-group-item list-group-item-action hoverable text-danger"
          @click="logout"
        >
          <i class="mdi mdi-logout"></i>
          logout
        </div>
      </div>
    </div>
  </span>
</template>


<script>
import { computed } from "@vue/reactivity"
import { AuthService } from "../services/AuthService"
import { AppState } from "../AppState"
export default {
  setup() {
    return {
      user: computed(() => AppState.user),
      account: computed(() => AppState.account),
      isStaff: computed(() => AuthService.hasRoles('staff')),
      async login() {
        AuthService.loginWithPopup()
      },
      async logout() {
        AuthService.logout({ returnTo: window.location.origin })
      }
    }
  }
}
</script>


<style lang="scss" scoped>
.dropdown-menu {
  user-select: none;
  display: block;
  transform: scale(0);
  transition: all 0.15s linear;
}
.dropdown-menu.show {
  transform: scale(1);
}
.hoverable {
  cursor: pointer;
}
a:hover {
  text-decoration: none;
}

.profileImg {
  border-radius: 50%;
}
</style>
