import { RefObject, useEffect, useState } from 'react'

interface Args extends IntersectionObserverInit {
  freezeOnce
}
