export default class AppStore {
    public createRows() {
        let rows = [];
        for (let i = 1; i < 1000; i++) {
            rows.push({
                id: i,
                title: "Title " + i,
                count: i * 1000
            });
        }

        return rows;
    };
}
