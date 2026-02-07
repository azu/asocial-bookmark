declare module "hatebu-mydata-parser" {
    const hatebuParser: {
        parse(text: string): { title: string; comment: string; url: string; date: Date }[];
    };
    export default hatebuParser;
}
