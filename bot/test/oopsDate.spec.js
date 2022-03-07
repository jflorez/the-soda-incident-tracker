require('dotenv').config();
const { expect } = require('chai');
const { insertIncident, getLatestIncident, getCurrentIncidents } = require('../../db/db_connector');
var should = require('chai').should()
describe('date calculations', ()=> {
    it('validate days without incident', async ()=> {
        const rows = await getCurrentIncidents('jgflorez', 'soda');
        let gap = 0
        for(entry of rows) {
            if(rows.indexOf(entry) < rows.length-1) {
                const currentGap = rows[rows.indexOf(entry)+1].oops - entry.oops;
                gap = currentGap>gap ? currentGap : gap;
            }
        }
        expect(gap).to.be.greaterThan(0);
        //await insertIncident('jgflorez', 'soda');
        // const {user, item, oops} = await getLatestIncident('testuser');
        // const oopsDate = new Date(oops);
		// const now = new Date(new Date().getTime() + 86400000);
        // const days = Math.floor((now - oopsDate)/(1000 * 60 * 60 * 24));
        // days.should.be.greaterThanOrEqual(1);
    });
});
