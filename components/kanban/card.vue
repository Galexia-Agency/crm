
<style lang="scss" scoped>
  .card {
    position: relative;
    border-radius: 3px;
    transition: background-color .25s ease-in-out;
    &:not(.archived) {
      &:hover,
      &:active,
      &:focus {
        background-color: rgb(225 225 225);
        cursor: pointer
      }
    }
    &.icons_draggable {
      cursor: initial;
      .icons {
        display: none
      }
      .card-title {
        max-width: 100%
      }
    }
    &.isnt_draggable {
      cursor: initial
    }
  }
  .icons {
    position: absolute;
    top: 10px;
    right: 10px;
    display: grid;
    grid-auto-flow: column;
    gap: .5rem;
    cursor: pointer
  }
  .icon {
    width: 1.1rem;
    height: 1.1rem;
    transition: color .25s ease-in-out;
    &:hover {
      color: black
    }
  }
  .is-overdue {
    color: red;
    border: 1px solid red;
    .card-date {
      color: red
    }
  }
  .icon-edit {
    opacity: 0;
    .card:hover & {
      opacity: 1
    }
  }
  @media (hover: none) {
    .icon-edit {
      .card & {
        opacity: 1
      }
    }
  }
</style>

<template>
  <div :key="`${card.id}_${card.archived}_${card.date}_inner`" class="card" :class="classes" :data-id="card.id" @click="openUpdateModal">
    <div class="icons">
      <template v-if="icons && (project.admin.includes(userInfo.email) || (project.contributor && project.contributor.includes(userInfo.email)))">
        <template v-if="card.archived">
          <FontAwesomeIcon :icon="['fa-solid', 'fa-box-archive']" class="icon icon-edit" @click.stop="unarchive" />
          <FontAwesomeIcon v-if="project.admin.includes(userInfo.email)" :icon="['fa-solid', 'fa-trash-can']" class="icon icon-edit" @click.stop="remove" />
        </template>
        <template v-else>
          <FontAwesomeIcon :icon="['fa-solid', 'fa-box-archive']" class="icon icon-edit" @click.stop="archive" />
        </template>
      </template>
    </div>
    <div v-if="card">
      <!-- Only put the first word through as a URL -->
      <p v-if="validURL(card.title.split(' ')[0])" class="card-title">
        <a target="_blank" :href="card.title.split(' ')[0]" v-text="formatURL(card.title.split(' ')[0])" />
        <!-- deepcode ignore PureMethodReturnValueIgnored: Value is returned as it is in v-text -->
        <span v-text="card.title.split(' ').slice(1).join(' ')" />
      </p>
      <p v-else class="card-title" v-text="card.title" />
      <p
        v-if="card.description && card.description !== '<p></p>' && card.description !== ' '"
      >
        <FontAwesomeIcon :icon="['fa-solid', 'fa-bars']" />
      </p>
      <p v-if="card.date" class="card-date">
        <FontAwesomeIcon :icon="['fa-solid', 'fa-calendar-alt']" />
        {{ `${card.day} ${card.dayNo} ${card.month} - ${daysRemaining(card.dateUNIX)}` }}
      </p>
      <p v-if="card.assignee && card.assignee !== userInfo.email" class="card-date">
        <FontAwesomeIcon :icon="['fa-solid', 'fa-user']" />
        {{ card.assignee }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    card: {
      type: Object,
      required: true
    },
    icons: {
      type: Boolean,
      default: true
    },
    project: {
      type: Object,
      default: null
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ]),
    classes () {
      return {
        'is-due': this.isDue,
        'is-overdue': this.isOverdue,
        icons_draggable: !this.icons,
        archived: this.card.archived,
        isnt_draggable: this.icons && !(this.project.admin.includes(this.userInfo.email) || (this.project.contributor && this.project.contributor.includes(this.userInfo.email)))
      }
    },
    isOverdue () {
      return this.card.dateUNIX && this.card.dateUNIX < Date.now()
    },
    isDue () {
      const date = this.card.dateUNIX
      const due = date - (1000 * 60 * 60 * 24) * 3
      const now = Date.now()
      return date > now && now > due
    }
  },
  methods: {
    openUpdateModal () {
      if (!this.card.archived) {
        this.$emit('open-update-modal', { card: this.card })
      }
    },
    unarchive () {
      this.$emit('unarchive', this.card)
    },
    archive () {
      this.$emit('archive', this.card)
    },
    remove () {
      this.$emit('remove', this.card)
    }
  }
}
</script>
