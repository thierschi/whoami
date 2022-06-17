export interface INote {
    id: string;
    value: string;
}

export interface ILocalNotes {
    code: string;
    notes: INote[];
}
