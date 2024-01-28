import { requestUpdateEmail, requestUpdatePhone } from './RequestsUpdateInfos'

describe('requestUpdateEmail', () => {
  it('returns true on successful update', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, status: 200 }))

    const result = await requestUpdateEmail(
      { email: { email: 'test@example.com' } },
      'mockToken'
    )

    expect(result).toBe(true)

    global.fetch.mockRestore()
  })

  it('throws an error on unsuccessful update', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false, status: 400 }))

    await expect(
      requestUpdateEmail({ email: { email: 'test@example.com' } }, 'mockToken')
    ).rejects.toThrowError('HTTP error! Status: 400')

    global.fetch.mockRestore()
  })
})

describe('requestUpdatePhone', () => {
  it('returns true on successful update', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, status: 200 }))

    const result = await requestUpdatePhone(
      { phone: { phone: '123-456-7890' } },
      'mockToken'
    )

    expect(result).toBe(true)

    global.fetch.mockRestore()
  })

  it('throws an error on unsuccessful update', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false, status: 400 }))

    await expect(
      requestUpdatePhone({ phone: { phone: '123-456-7890' } }, 'mockToken')
    ).rejects.toThrowError('HTTP error! Status: 400')

    global.fetch.mockRestore()
  })
})
