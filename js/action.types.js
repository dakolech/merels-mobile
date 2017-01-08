
export type Action =
  { type: 'PUSH_NEW_ROUTE', route: string }
    | { type: 'POP_ROUTE' }
    | { type: 'POP_TO_ROUTE', route: string }
    | { type: 'REPLACE_ROUTE', route: string }
    | { type: 'REPLACE_OR_PUSH_ROUTE', route: string }
    | { type: 'OPEN_DRAWER'}
    | { type: 'CLOSE_DRAWER'}
    | { type: 'SET_LIST', list: string}
    | { type: 'USER_LOGIN_SUCCESS', name: string}
    | { type: 'USER_LOGIN_ERROR', name: string}
    | { type: 'PASSWORD_RESET_SUCCESS', name: string}
    | { type: 'PASSWORD_RESET_ERROR', name: string}
    | { type: 'AUTH_PENDING', name: string}

export type AuthCredentials = {
  email: string,
  password: string,
};
export type Dispatch = (action:Action | Array<Action>) => any;
export type GetState = () => Object;
export type PromiseAction = Promise<Action>;
