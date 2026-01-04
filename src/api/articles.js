import apiClient from './client'

export const articleApi = {
getPublicArticles: (category) => {
	let url = '/public/articles'
	if (category) {
		url += `?category=${category}`
	}
	return apiClient.get(url)
},

getPublicArticle: (id) => {
	return apiClient.get(`/public/articles/${id}`)
},

getAllArticles: () => {
	return apiClient.get('/articles')
},

getArticle: (id) => {
	return apiClient.get(`/articles/${id}`)
},

createArticle: (data) => {
	return apiClient.post('/articles', data)
},

updateArticle: (id, data) => {
	return apiClient.put(`/articles/${id}`, data)
},

deleteArticle: (id) => {
	return apiClient.delete(`/articles/${id}`)
}
}