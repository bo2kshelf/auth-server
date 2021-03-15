export type CRUDActions = 'create' | 'read' | 'update' | 'delete';

export type MyselfPermission = `read:myself` | `update:myself`;
export type UsersPermission = `${CRUDActions}:users`;

export type ContentsPermission = `${CRUDActions}:contents`;

export type MyrecordsPermission = `${CRUDActions}:myrecords`;
export type RecordsPermission = `${CRUDActions}:records`;

export type Permission =
  | MyselfPermission
  | UsersPermission
  | ContentsPermission
  | RecordsPermission
  | MyrecordsPermission;
