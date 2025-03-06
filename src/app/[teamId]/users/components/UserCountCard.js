import { Card, CardContent } from "@mui/material"




const UserCountCard = ({
  small, medium, large, count
}) => {

  return(
    <Card>
      <CardContent>
        <div className="flex justify-between items-end">
          <div>
            <h5 className="text-sm">{small}</h5>
            <h4 className="font-bold">{medium}</h4>
            <h3 className="mt-4 text-xl font-bold">{large}</h3>
          </div>
          <h3 className="text-4xl font-bold ">{count}</h3>
        </div>

      </CardContent>
    
    </Card>
  )
}

export default UserCountCard