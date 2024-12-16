export function countAliases<T extends { _count: Record<string, number> }>(r: T) {
    const { _count, ...rest } = r;

    let gg: { [K in keyof T['_count']as `${K & string}Count`]: number } = {} as any

    // Menyalin nilai dari _count ke dalam gg dengan nama kunci yang sudah diubah
    for (let index of Object.keys(_count)) {
        gg[index + "Count"] = _count[index];
    }

    // Menggabungkan rest dan gg menjadi satu objek
    return {
        ...rest,
        ...gg
    };
}
