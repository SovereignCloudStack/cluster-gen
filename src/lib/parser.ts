export const parser = ({ ccs }: any) => {

    // Reduce method to get unique clusterclasses
    const unique = ccs.reduce((acc: any, obj: any) => {
        if (!acc.some(o => o.metadata.name === obj.metadata.name)) {
            acc.push(obj);
        }
        return acc;
    }, []);

    return ccs
}