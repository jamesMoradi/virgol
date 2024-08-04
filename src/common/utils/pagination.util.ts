import { PaginationDto } from "../dtos/pagination.dto";

export const paginationSolver = (paginationDto : PaginationDto) => {
    let {limit, page} = paginationDto;
    if (!page || page <= 1) page = 0
    else page -= 1

    if (!limit || limit <= 10) limit = 10
    let skip = page * limit

    return {
        page : page === 0 ? 1 : page,
        limit,
        skip
    }
}

export const paginationGenerator = (count : number = 0, page: number = 0, limit : number = 0) => {
    return {
        totalCount : +count,
        page : +page,
        limit : +limit,
        pageCount : Math.ceil(count / limit)
    }
}