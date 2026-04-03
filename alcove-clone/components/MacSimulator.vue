<template>
  <section class="isolate flex w-full flex-col items-center px-0 select-none lg:px-8">
    <div class="relative h-48 w-full overflow-visible sm:aspect-2/1 sm:h-full sm:overflow-hidden">
      <!-- Top Bar -->
      <div class="absolute top-0 right-0 left-0 z-20 flex justify-center sm:grid sm:grid-cols-3">
        <div class="flex p-5">
          <!-- Left side icons -->
        </div>
        <div class="flex justify-center p-5">
          <div class="select-none">
            <div class="relative flex h-10 origin-top overflow-hidden rounded-xl text-orange-25 transition-shadow duration-300">
              <div class="h-full w-full rounded-xl bg-stone-950">
                <div class="absolute left-0 top-0 flex h-10 items-center">
                  <!-- Dynamic Island left -->
                </div>
                <div class="absolute right-0 top-0 flex h-10 items-center">
                  <!-- Dynamic Island right -->
                </div>
                <div class="pointer-events-none absolute bottom-0 left-0 right-0 flex origin-top justify-center pb-[11px] text-xs font-semibold text-stone-300/85 opacity-0 mask-[linear-gradient(to_left,rgba(0,0,0,0)_7%,rgba(0,0,0,1)_11%,rgba(0,0,0,1)_89%,rgba(0,0,0,0)_93%)]">
                  <!-- Dynamic Island text -->
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end p-5">
          <!-- Right side icons -->
        </div>
      </div>

      <!-- Main Content -->
      <div class="absolute inset-0">
        <div class="absolute bottom-24 z-20 hidden w-full items-center justify-center 2xl:flex">
          <!-- Bottom controls -->
        </div>
        <div class="absolute inset-0 z-10 mt-22 mb-6 flex flex-col items-center justify-end md:justify-between lg:mt-23">
          <div class="flex flex-col items-center">
            <!-- Work Focus Badge -->
            <div class="mt-3.5 hidden items-center space-x-5 font-semibold text-purple-300/90 saturate-150 lg:flex">
              <div class="relative flex w-18 items-center">
                <div class="absolute flex w-18 items-center">
                  <div class="mr-1.5 ml-0.5 size-[18px]">
                    <svg class="absolute size-[18px] fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" aria-hidden="true">
                      <path d="M19.222 1C21.74 1 23 2.285 23 4.808v18.396C23 25.74 21.74 27 19.222 27H7.79C5.26 27 4 25.739 4 23.204V4.808C4 2.285 5.26 1 7.79 1zm-5.71 17.972c-4.254 0-6.247 3.42-6.247 4.717 0 .45.22.764.709.764h11.065c.501 0 .72-.315.72-.764 0-1.297-1.992-4.717-6.246-4.717m0-7.652c-1.723 0-3.106 1.492-3.106 3.287 0 1.928 1.383 3.37 3.107 3.382 1.723.012 3.105-1.455 3.105-3.383 0-1.794-1.382-3.285-3.105-3.286M10.37 3.571a.826.826 0 0 0-.83.813c0 .448.378.812.83.812h6.26c.464 0 .83-.364.83-.812a.82.82 0 0 0-.83-.813z"></path>
                    </svg>
                  </div>
                  <div>Work</div>
                </div>
              </div>
              <div class="flex items-center">
                <div class="relative mr-[5px] ml-0.5 size-[18px]">
                  <svg class="absolute size-[18px] fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" aria-hidden="true">
                    <path d="M13.668 19.691c3.258 0 5.965-2.707 5.965-5.976 0-3.281-2.707-5.988-5.965-5.988s-5.965 2.707-5.965 5.988c0 3.27 2.707 5.976 5.965 5.976M13.68 5.56c.55 0 1.008-.457 1.008-1.02V2.02C14.688 1.458 14.23 1 13.68 1a1.02 1.02 0 0 0-1.02 1.02v2.52c0 .562.457 1.019 1.02 1.019m5.742 2.402a1.03 1.03 0 0 0 1.441 0l1.793-1.793a1.04 1.04 0 0 0 0-1.441 1.026 1.026 0 0 0-1.43 0L19.423 6.53a1.026 1.026 0 0 0 0 1.43m2.379 5.754c0 .55.469 1.008 1.02 1.008h2.519c.55 0 1.008-.457 1.008-1.008s-.457-1.02-1.008-1.02h-2.52c-.55 0-1.02.47-1.02 1.02m-2.38 5.754a1.026 1.026 0 0 0 0 1.43l1.806 1.816a1.05 1.05 0 0 0 1.43-.012 1.026 1.026 0 0 0 0-1.43l-1.805-1.804a1.05 1.05 0 0 0-1.43 0M13.68 21.87c-.563 0-1.02.457-1.02 1.008v2.531c0 .55.457 1.008 1.02 1.008.55 0 1.008-.457 1.008-1.008V22.88c0-.55-.458-1.008-1.008-1.008M7.926 19.47c-.399-.375-1.055-.375-1.442 0l-1.793 1.793a1.037 1.037 0 0 0-.011 1.43 1.064 1.064 0 0 0 1.441.011l1.793-1.805a1.037 1.037 0 0 0 .012-1.43m-2.38-5.754c0-.55-.468-1.02-1.019-1.02h-2.52c-.55 0-1.007.47-1.007 1.02s.457 1.008 1.008 1.008h2.52c.55 0 1.019-.457 1.019-1.008M7.915 7.96c.387-.375.387-1.043.012-1.43L6.133 4.727c-.387-.375-1.043-.387-1.43 0-.387.398-.387 1.054-.012 1.43L6.484 7.96a1.026 1.026 0 0 0 1.43 0"></path>
                  </svg>
                </div>
                <div class="relative inline-flex tabular-nums">
                  <span>24</span>
                  <span>°</span>
                </div>
              </div>
            </div>
          </div>
          <div class="shimmer animate-shine cursor-pointer bg-clip-text! p-6 text-2xl font-bold text-transparent saturate-150 sm:text-lg sm:font-semibold lg:p-4" @click="handleUnlock">
            Press to unlock
          </div>
        </div>
      </div>

      <!-- Wallpaper Background -->
      <div class="rounded-5xl absolute top-0 right-0 left-0 h-48 w-full overflow-hidden bg-stone-900 sm:h-full">
        <picture>
          <source media="(min-width: 640px)" srcset="https://cdn.tryalcove.com/images/wallpaper.webp" type="image/webp">
          <source media="(max-width: 640px)" srcset="https://cdn.tryalcove.com/images/wallpaper-alt.webp" type="image/webp">
          <img class="aspect-video h-96 w-full object-cover blur-sm sm:h-auto sm:blur-none" src="https://cdn.tryalcove.com/images/wallpaper.jpg" alt="Wallpaper" style="transform: translateY(0px);">
        </picture>
      </div>
    </div>
    <div class="mt-4 hidden cursor-default items-center p-4 text-sm font-bold text-orange-950/40 select-none sm:flex">
      <svg class="mr-2 h-3.5 w-3.5 fill-current transition duration-500" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M5.06 3.024C4.804 1.238 6.858.052 8.276 1.168l17.117 13.466c1.47 1.159.688 3.522-1.182 3.574l-7.03.19a1.998 1.998 0 0 0-1.65.953l-3.68 5.993c-.98 1.594-3.418 1.089-3.685-.764L5.06 3.024Z"></path>
      </svg>
      Psst… it's interactive!
    </div>
  </section>
</template>

<script setup lang="ts">
import { useTimeStore } from '~/stores/time'

const timeStore = useTimeStore()
const isUnlocked = ref(false)

onMounted(() => {
  timeStore.start()
})

onUnmounted(() => {
  timeStore.stop()
})

function handleUnlock() {
  isUnlocked.value = !isUnlocked.value
}
</script>
