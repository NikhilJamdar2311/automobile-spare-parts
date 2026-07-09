module.exports = {
    types: [
        { value: 'feat', name: 'feat:     A new feature' },
        { value: 'fix', name: 'fix:      A bug fix' },
        { value: 'docs', name: 'docs:     Documentation changes' },
        { value: 'style', name: 'style:    Formatting only' },
        { value: 'refactor', name: 'refactor: Code refactoring' },
        { value: 'test', name: 'test:     Tests' },
        { value: 'chore', name: 'chore:    Build/tooling changes' },
    ],

    messages: {
        type: 'Select the type of change:',
    },
}
