'use strict'
const fetch = require('node-fetch');

class Lockitron {
  constructor(options){
    this.clientId = options.client_id;
    this.clientSecret = options.client_secret;
    this.token = options.token || '';
    this.baseUrl = 'https://api.lockitron.com/v2';
  }

  async locks() {
    const req = await fetch(`${this.baseUrl}/locks?access_token=${this.token}`);
    return await req.json();
  }

  async lock(id) {
    const req = await fetch(`${this.baseUrl}/locks/${id}?access_token=${this.token}`, {
      method: 'PUT',
      body: JSON.stringify({
        state: 'lock'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return await req.json();
  }

  async unlock(id) {
    const req = await fetch(`${this.baseUrl}/locks/${id}?access_token=${this.token}`, {
      method: 'PUT',
      body: JSON.stringify({
        state: 'unlock'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return await req.json();
  }
}

module.exports = Lockitron
