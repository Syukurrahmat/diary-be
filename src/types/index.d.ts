type APIResponse<T = any> = {
    statusCode: number;
    message: string;
    error: string | null;
    data: T;
}

type Paginated = {
    rows: any[],
    meta: MetaPaginated
}
type MetaPaginated = {
    total: number;
    totalPage: number;
    page: number;
    search: string | undefined;
    limit: number;
    prev: number | null;
    next: number | null;
}

type UserInfo = {
    email : string,
    userId: number,
    timezone: string
}


type SimpleEntryData = {
    id: number;
    content: string;
    localDate: string;
    datetime: Date;
    location: {
        address: string;
        id: number;
    } | null;
    images: {
        imageUrl: string;
        width: number;
        height: number;
    }[];
    tags: {
        id: number,
        name: string,
    }[]
}