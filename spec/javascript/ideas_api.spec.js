import fetch from 'fetch-vcr';
import IdeasApi from 'ideas_api'

describe('Ideas API', ()=> {
  beforeAll(() => {
    fetch.configure({
      fixturePath: './spec/javascript/fixtures/',
      mode: 'cache'
    })
  })

  test('sign up and logout', async () => {
    const api = new IdeasApi({ rootUrl: 'http://localhost:3000' })

    expect(api.isAuthenticated()).toBe(false)

    const authenticationCallback = jest.fn()
    api.on('authentication', authenticationCallback)

    await api.signUp('Jack', 'jack@mailinator.com', 'supersecret')

    expect(authenticationCallback.mock.calls.length).toBe(1)
    expect(api.isAuthenticated()).toBe(true)

    const userInfoCallback = jest.fn()

    api.on('authentication', authenticationCallback)
    api.on('userInfo', userInfoCallback)

    await api.logout()
    expect(api.isAuthenticated()).toBe(false)
    expect(api.isUserInfoLoaded()).toBe(false)
    expect(authenticationCallback.mock.calls.length).toBe(3)
    expect(userInfoCallback.mock.calls.length).toBe(1)

    await api.login('jack@mailinator.com', 'supersecret')
    await api.deleteAccount()
  })

  describe('signed up', ()=> {
    const api = new IdeasApi({ rootUrl: 'http://localhost:3000' })

    beforeAll(async () => {
      fetch.configure({
        fixturePath: './spec/javascript/fixtures/signed_up',
        mode: 'cache'
      })
      await api.signUp('Jack', 'jack@mailinator.com', 'supersecret')
      await api.logout()
    })

    afterAll(async () => {
      await api.login('jack@mailinator.com', 'supersecret')
      await api.deleteAccount()
    })

    test('login', async ()=> {
      expect(api.isAuthenticated()).toBe(false)
      expect(api.isUserInfoLoaded()).toBe(false)

      const authenticationCallback = jest.fn()
      const userInfoCallback = jest.fn()

      api.on('authentication', authenticationCallback)
      api.on('userInfo', userInfoCallback)

      await api.login('jack@mailinator.com', 'supersecret')

      expect(authenticationCallback.mock.calls.length).toBe(1)
      expect(api.isAuthenticated()).toBe(true)

      expect(userInfoCallback.mock.calls.length).toBe(1)
      expect(api.isUserInfoLoaded()).toBe(true)
      expect(api.userInfo).toMatchObject({ name: 'Jack', email: 'jack@mailinator.com', avatar_url:'http://gravatar.com/avatar/6bd9c66c358fbaada0bb0a46522eac40.png?d=mm&s=200'})
    })

    test('logout', async ()=> {
      const api = new IdeasApi({ rootUrl: 'http://localhost:3000' })
      await api.login('jack@mailinator.com', 'supersecret')
      const authenticationCallback = jest.fn()
      const userInfoCallback = jest.fn()

      api.on('authentication', authenticationCallback)
      api.on('userInfo', userInfoCallback)

      await api.logout()
      expect(api.isAuthenticated()).toBe(false)
      expect(api.isUserInfoLoaded()).toBe(false)
      expect(authenticationCallback.mock.calls.length).toBe(1)
      expect(userInfoCallback.mock.calls.length).toBe(1)
    })

    describe('logged in', ()=> {
      const api = new IdeasApi({ rootUrl: 'http://localhost:3000' })

      beforeAll(async () => {
        fetch.configure({
          fixturePath: './spec/javascript/fixtures/signed_up/logged_in',
          mode: 'cache'
        })
        await api.login('jack@mailinator.com', 'supersecret')
      })

      test('createIdea', async ()=> {
        const ideaAddedCallback = jest.fn()
        api.on('ideaAdded', ideaAddedCallback)

        await api.createIdea({ content: 'Great Idea!', impact: 10, ease: 5, confidence: 3})

        expect(ideaAddedCallback.mock.calls.length).toBe(1)

        const idea = ideaAddedCallback.mock.calls[0][0]

        expect(idea.id).toBeDefined()
        expect(idea.created_at).toBeDefined()
        expect(idea.average_score).toBeDefined()
        expect(idea.content).toBe('Great Idea!')
        expect(idea.impact).toBe(10)
        expect(idea.ease).toBe(5)
        expect(idea.confidence).toBe(3)

        await api.deleteIdea(idea)
      })

      describe('load more pages', () => {
        var ideas = []
        beforeAll(async () => {
          fetch.configure({
            fixturePath: './spec/javascript/fixtures/signed_up/logged_in/load_more_pages',
            mode: 'cache'
          })
          api.on('ideaAdded', idea => ideas.push(idea))
          await api.createIdea({ content: 'Great Idea! 1', impact: 10, ease: 5, confidence: 3})
          await api.createIdea({ content: 'Great Idea! 2', impact: 10, ease: 5, confidence: 3})
          await api.createIdea({ content: 'Great Idea! 3', impact: 10, ease: 5, confidence: 3})
          await api.createIdea({ content: 'Great Idea! 4', impact: 10, ease: 5, confidence: 3})
          await api.createIdea({ content: 'Great Idea! 5', impact: 10, ease: 5, confidence: 3})
          await api.createIdea({ content: 'Great Idea! 6', impact: 10, ease: 5, confidence: 3})
          await api.createIdea({ content: 'Great Idea! 7', impact: 10, ease: 5, confidence: 3})
          await api.createIdea({ content: 'Great Idea! 8', impact: 10, ease: 5, confidence: 3})
          await api.createIdea({ content: 'Great Idea! 9', impact: 10, ease: 5, confidence: 3})
          await api.createIdea({ content: 'Great Idea! 10', impact: 10, ease: 5, confidence: 3})
          await api.createIdea({ content: 'Great Idea! 11', impact: 10, ease: 5, confidence: 3})
        })

        afterAll(async ()=>{
          for(var i = 0; i < ideas.length; i++) {
            await api.deleteIdea(ideas[i])
          }
        })

        test('load ideas', async ()=> {
          const ideaAddedCallback = jest.fn()

          api.on('ideaAdded', ideaAddedCallback)
          await api.fetchIdeas()

          expect(ideaAddedCallback.mock.calls.length).toBe(10)
          for(var i = 0; i < ideaAddedCallback.mock.calls.length; i++) {
            let call = ideaAddedCallback.mock.calls[i]
            expect(call[0]).toMatchObject(ideas[i])
          }
        })

        test('load page 2', async () => {
          const ideaAddedCallback = jest.fn()

          api.on('ideaAdded', ideaAddedCallback)
          await api.fetchIdeas(2)

          expect(ideaAddedCallback.mock.calls.length).toBe(1)
          expect(ideaAddedCallback.mock.calls[0][0]).toMatchObject(ideas[10])
        })
      })

      describe('with idea', () => {
        var idea

        beforeAll(async ()=>{
          fetch.configure({
            fixturePath: './spec/javascript/fixtures/signed_up/logged_in/with_idea',
            mode: 'cache'
          })
          api.on('ideaAdded', createdIdea => {
            idea = createdIdea
          })
          await api.createIdea({ content: 'Great Idea!', impact: 10, ease: 5, confidence: 3})
        })

        afterAll(async ()=>{
          await api.deleteIdea(idea)
        })

        test('update idea', async () => {
          const ideaUpdatedCallback = jest.fn()

          api.on('ideaUpdated', ideaUpdatedCallback)
          idea.content = 'Something something'

          await api.updateIdea(idea)

          expect(ideaUpdatedCallback.mock.calls.length).toBe(1)
          const updatedIdea = ideaUpdatedCallback.mock.calls[0][0]
          expect(updatedIdea.content).toBe('Something something')
        })

        test('deleteIdea', async ()=> {
          const removedIdeaCallback = jest.fn()
          api.on('ideaRemoved', removedIdeaCallback)

          await api.deleteIdea(idea)

          expect(removedIdeaCallback.mock.calls.length).toBe(1)

          const deletedIdea = removedIdeaCallback.mock.calls[0][0]

          expect(idea).toBe(deletedIdea)
        })
      })
    })
  })
})
