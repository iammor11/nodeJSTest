const fetch = require('node-fetch');

exports.getCategories = async (req, res, next) => {
    try {
        const { page } = req.body
        const params = new URLSearchParams();
        params.append('page', page);
        const response = await fetch('https://demo2.meals4u.net/fe/api.test.php', { method: 'POST', body: params });
        const result = await response.json();
        return res.status(200).json({
            message: "Successfully get the categories",
            result: result?.data
        })
    }
    catch (error) {
        return res.status(500).json({
            message: "Something went wrong!",
            error
        });
    }
}