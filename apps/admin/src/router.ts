// Generouted, changes to this file will be overridden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
  | `/`
  | `/auth/login`
  | `/auth/signup`
  | `/eval/evaluation`
  | `/exam/:test`
  | `/list/datatable`
  | `/load`
  | `/results/allresults/testresults`
  | `/results/allresults/tnaresults`
  | `/sample/:page`
  | `/tna/tna`

export type Params = {
  '/exam/:test': { test: string }
  '/sample/:page': { page: string }
}

export type ModalPath = never

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath>()
export const { redirect } = utils<Path, Params>()
