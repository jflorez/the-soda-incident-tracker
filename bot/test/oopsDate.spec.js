require('dotenv').config();
const { insertIncident, getLatestIncident } = require('../../db/db_connector');
var should = require('chai').should()
describe('date calculations', ()=> {
    it('validate days without incident', async ()=> {
        await insertIncident('testuser', 'soda');
        const {user, item, oops} = await getLatestIncident('testuser');
        const oopsDate = new Date(oops);
		const now = new Date(new Date().getTime() + 86400000);
        const days = Math.floor((now - oopsDate)/(1000 * 60 * 60 * 24));
        days.should.be.greaterThanOrEqual(1);
    });
});
